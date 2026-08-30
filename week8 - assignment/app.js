require('dotenv').config();

const express = require('express');
const app = express();


// Import middleware
const logger = require('./middlewares/logger');
const { validateCreateTodo, validateUpdateTodo } = require('./middlewares/validator');
const { errorHandler, notFoundHandler, AppError } = require('./middlewares/errorHandler');
const cors = require('cors');
const connectDB = require('./database/db');
const validateObjectId = require('./middlewares/validateObjectId');
const Todo = require('./models/todo.model');

// Middleware
app.set('trust proxy', true); // Trust proxy for accurate IP
app.use(express.json()); // Parse JSON bodies
app.use(cors());  
app.use(logger); // Log all requests

//MongoDb data Store
connectDB();

// Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Todo API is running!',
    endpoints: {
      GET: ['/todos?completed=true/false', '/todos?task=search', '/todos', '/todos/:id', '/todos/active', '/todos/completed'],
      POST: ['/todos'],
      PATCH: ['/todos/:id'],
      DELETE: ['/todos/:id']
    }
  });
});


// GET all todos with QUERY PARAMETER SUPPORT)
app.get('/todos', async (req, res, next) => {
  try {
    // Build filter object from query parameters
    const filter = {};
    
    // Filter by completed status
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }
    
    // Filter by task (partial match - case insensitive)
    if (req.query.task) {
      filter.task = { $regex: req.query.task, $options: 'i' };
    }
    
    // Execute query with filters
    const todos = await Todo.find(filter);
    
    // Send simplified response
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
});















app.get('/todos/active', async (req, res, next) => {
  try {
      const todos = await Todo.find({ completed: false });
      res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

app.get('/todos/completed', async (req, res, next) => {
  try {
      const todos = await Todo.find({ completed: true });
      res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

// GET Single Todo with try/catch
app.get('/todos/:id', validateObjectId, async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id)
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found'});
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// POST route with Validation
app.post('/todos', validateCreateTodo, async (req, res, next) => {
  try {
    const { task, completed } = req.body;
    const newTodo = new Todo({
    task,
    completed: completed || false   
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

// PATCH (UPDATE) route with Validation
app.patch('/todos/:id', validateObjectId, validateUpdateTodo, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body,
      { new: true,
        runValidators: true
      }
    );
    
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

//PUT (Full Update)
app.put('/todos/:id', validateObjectId, async (req, res, next) => {
  try {
    const { task, completed } = req.body;             // Extract only the allowed fields from request body
        
    if (!task) {
      throw new AppError('Task is required for full update, 400');
    }
    
    if (completed === undefined || completed === null) {
      throw new AppError('Completed status is required for full update', 400);
    }

    if (typeof completed !== 'boolean') {
      throw new AppError('Completed must be a boolean value', 400);
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id,
      {
        task: task.trim(),
        completed: completed
      },
      {
        new: true,
        runValidators: true,
        overwrite: true,
        strict: true
      }
    );

    if (!todo) {
      throw nreAppError('Todo not found', 404);
    }

    res.status(200).json({
        message: 'Todo updated successfully',
        todo: todo
      });
  } catch (error) {
    next(error);
  }
});

// DELETE route
app.delete('/todos/:id', validateObjectId, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    res.status(200).json({ message: `Todo ${req.params.id} deleted successfully!` });
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