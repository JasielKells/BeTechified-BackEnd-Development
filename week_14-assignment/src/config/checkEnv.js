const requiredEnvVars = [
  'PORT', 'MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN',
  'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'
];

const checkEnv = () => {
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    console.error('FATAL ERROR: Missing required environment variables:');
    missingVars.forEach((v) => console.error(`   - ${v}`));
    process.exit(1);
  }
  console.log('All required environment variables are set.');
};

module.exports = checkEnv;