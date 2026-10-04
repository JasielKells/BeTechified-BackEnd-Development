const express = require('express');
const router = express.Router();

const { signupUser, loginUser } = require('../controllers/user.controller');
const { validateSignup, validateLogin } = require('../validations/user.validation');

router.post('/signup', validateSignup, signupUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;