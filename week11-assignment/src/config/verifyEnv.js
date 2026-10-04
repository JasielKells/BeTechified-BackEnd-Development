const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];

const verifyEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key] || process.env[key].trim() === ''
  );

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('Create a .env file at the project root with these values.');
    console.error('See .env.example for the expected format.');
    process.exit(1);
  }

  console.log('Environment variables verified.');
};

module.exports = verifyEnv;