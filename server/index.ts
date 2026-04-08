import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');

app.use(cors());
app.use(express.json()); // This allows the server to understand JSON data sent from the frontend

// Helper function to read tasks from the file
const readTasks = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write tasks to the file
const writeTasks = (tasks: any) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error reading tasks');
  }
});

// Create a new task
app.post('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    const newTask = {
      id: `task-${Date.now()}`, // Generate a unique ID using the current time
      ...req.body,
      status: 'Pending', // Default status for new tasks
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).send('Error saving task');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
