const express = require('express');
const router = express.Router();

const { signupUser, loginUser } = require('../controllers/user.controller');

// Import the validation middleware
const { validateSignup, validateLogin } = require('../validations/user.validation');

// Apply validation before the controller
router.post('/signup', validateSignup, signupUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;