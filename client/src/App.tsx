import React, { useEffect, useState } from 'react';
import './App.css';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  owner: string;
  unit: string;
  status: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the new task form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newUnit, setNewUnit] = useState('Unit A');

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks');
      if (!response.ok) throw new Error('Could not fetch tasks.');
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskToAdd = {
      title: newTitle,
      description: newDescription,
      deadline: newDeadline,
      owner: newOwner,
      unit: newUnit,
    };

    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToAdd),
      });

      if (response.ok) {
        // Refresh the tasks list
        fetchTasks();
        // Clear the form
        setNewTitle('');
        setNewDescription('');
        setNewDeadline('');
        setNewOwner('');
      } else {
        alert('Failed to save task.');
      }
    } catch (err) {
      alert('Error connecting to the server.');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>📊 HOD Task Manager</h1>
        <p>Manage tasks across Unit A, B, and C with ease.</p>
      </header>

      <main className="main-content">
        {/* TASK INPUT FORM */}
        <section className="form-section">
          <h2>Assign New Task</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Detailed Description" 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)} 
              required 
            />
            <div className="form-row">
              <div className="input-group">
                <label>Deadline</label>
                <input 
                  type="date" 
                  value={newDeadline} 
                  onChange={(e) => setNewDeadline(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Owner</label>
                <input 
                  type="text" 
                  placeholder="Team Member" 
                  value={newOwner} 
                  onChange={(e) => setNewOwner(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="input-group">
              <label>Unit</label>
              <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                <option value="Unit A">Unit A</option>
                <option value="Unit B">Unit B</option>
                <option value="Unit C">Unit C</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">Add Task</button>
          </form>
        </section>

        {/* TASK DASHBOARD */}
        <section className="dashboard-section">
          <h2>Unit Status Board</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p className="error-msg">{error}</p>
          ) : (
            <div className="task-list">
              {tasks.length === 0 ? (
                <p>No tasks yet! Start by assigning one above.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </div>
                    <h3>{task.title}</h3>
                    <p className="task-desc">{task.description}</p>
                    <div className="task-meta">
                      <span><strong>Owner:</strong> {task.owner}</span>
                      <span><strong>Unit:</strong> {task.unit}</span>
                      <span><strong>Due:</strong> {task.deadline}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>HOD Management Suite v1.0</p>
      </footer>
    </div>
  );
}

export default App;
