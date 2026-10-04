require('dotenv').config();

const connectDB = require('./src/config/connectDB.js');
const verifyEnv = require('./src/config/verifyEnv.js');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    verifyEnv();          // Ensure env vars are present before anything else
    await connectDB();    // Connect to DB before accepting requests
    app.listen(PORT, () => {
      console.log(`Server is listening on Port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();