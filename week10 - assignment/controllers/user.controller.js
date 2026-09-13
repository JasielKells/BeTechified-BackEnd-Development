const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Step 2: Signup Logic
const signupUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password is hashed in the model's pre-save hook
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: 'User created successfully',
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

// Step 2: Login Logic
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const resUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };

    return res.status(200).json({ message: 'Login successful', token, user: resUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { signupUser, loginUser };