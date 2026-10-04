const logger = (req, res, next) => {
  const { method, originalUrl } = req;
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    console.log(`[${timestamp}] ${method} ${originalUrl} → ${res.statusCode}`);
  });

  next();
};

module.exports = logger;