// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err.stack);
  
  // Determine the status code
  const statusCode = err.statusCode || 500;
  
  // Send appropriate error response
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    status: statusCode,
    timestamp: new Date().toISOString(),
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
};

// Custom error class for easier error handling
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError
};