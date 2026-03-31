// user.controller.js - Business logic for User operations
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const config = require('../config/app.config');

const SALT_ROUNDS = 10;

/**
 * @desc  Register a new user
 * @route POST /api/users/register
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, fitnessGoal } = req.body;

    // --- Validation ---
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check if email already exists
    const existing = UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = UserModel.create({ name, email, password: hashedPassword, age, gender, fitnessGoal });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: user,
    });
  } catch (error) {
    console.error('[UserController] registerUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Login a user and return JWT
 * @route POST /api/users/login
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user (includes password)
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('[UserController] loginUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get user profile by ID
 * @route GET /api/users/:id
 */
const getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('[UserController] getUserById error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Get all users
 * @route GET /api/users
 */
const getAllUsers = (req, res) => {
  try {
    const users = UserModel.findAll();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('[UserController] getAllUsers error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Update user profile
 * @route PUT /api/users/:id
 */
const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, fitnessGoal } = req.body;

    const existing = UserModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updated = UserModel.update(id, { name, age, gender, fitnessGoal });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('[UserController] updateUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * @desc  Delete a user
 * @route DELETE /api/users/:id
 */
const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = UserModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('[UserController] deleteUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { registerUser, loginUser, getUserById, getAllUsers, updateUser, deleteUser };
