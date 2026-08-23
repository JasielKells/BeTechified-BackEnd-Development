require('dotenv').config();

const express = require('express');
const app = express();

// Import middleware
const logger = require('./middlewares/logger');
const { validateCreateTodo, validateUpdateTodo } = require('./middlewares/validator');
const { errorHandler, notFoundHandler, AppError } = require('./middlewares/errorHandler');

// Middleware
app.set('trust proxy', true); // Trust proxy for accurate IP
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Log all requests



// In-memory data store
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Todo API is running!',
    endpoints: {
      GET: ['/todos', '/todos/:id', '/todos/active', '/todos/completed'],
      POST: ['/todos'],
      PATCH: ['/todos/:id'],
      DELETE: ['/todos/:id']
    }
  });
});

// GET Routes
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => !t.completed);
  res.status(200).json(activeTodos);
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.status(200).json(completed);
});

// GET Single Todo with try/catch
app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// POST route with Validation
app.post('/todos', validateCreateTodo, async (req, res, next) => {
  try {
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const newTodo = {
      id: newId,
      task: req.body.task,
      completed: req.body.completed
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

// PATCH route with Validation
app.patch('/todos/:id', validateUpdateTodo, async (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    // Update only the fields that were provided
    if (req.body.task !== undefined) todo.task = req.body.task;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// DELETE route
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id);
    
    if (todos.length === initialLength) {
      throw new AppError('Todo not found', 404);
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Error Handling
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Global error handler

// Starting Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});