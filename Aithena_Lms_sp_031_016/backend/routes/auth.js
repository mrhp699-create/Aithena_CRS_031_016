const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Register user
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'teacher']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, password, role = 'student' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Prevent non-admin users from registering as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot register as admin'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // TEMPORARY: Fallback for testing without MongoDB
      console.log('⚠️  MongoDB not connected - using test credentials for development');

      // Test credentials for development
      const testUsers = {
        'admin@aithena.com': { name: 'System Administrator', role: 'admin', password: 'admin123' },
        'waseem@aithena.com': { name: 'Dr. Waseem', role: 'teacher', password: 'waseem123' },
        'najeebullah@aithena.com': { name: 'Najeebullah', role: 'teacher', password: 'najeeb123' },
        'rizwan@aithena.com': { name: 'Rizwan', role: 'teacher', password: 'rizwan123' },
        'sarah.johnson@aithena.com': { name: 'Dr. Sarah Johnson', role: 'teacher', password: 'teacher123' },
        'moaz@aithena.com': { name: 'Moaz', role: 'student', password: 'moaz123' },
        'areeba@aithena.com': { name: 'Areeba', role: 'student', password: 'areeba123' },
        'ali@aithena.com': { name: 'Ali', role: 'student', password: 'ali123' },
        'ruman@aithena.com': { name: 'Ruman', role: 'student', password: 'ruman123' },
        'taha@aithena.com': { name: 'Taha', role: 'student', password: 'taha123' }
      };

      const testUser = testUsers[email];
      if (!testUser || testUser.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials (using test mode)'
        });
      }

      // Create mock user object
      const mockUser = {
        _id: '507f1f77bcf86cd799439011', // Mock ObjectId
        name: testUser.name,
        email: email,
        role: testUser.role,
        status: 'active'
      };

      // Generate tokens with mock user
      const { accessToken, refreshToken } = generateTokens(mockUser);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({
        success: true,
        message: 'Login successful (test mode)',
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        },
        accessToken
      });
    }

    // Normal MongoDB login
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // TEMPORARY: Return mock user data for testing without MongoDB
      console.log('⚠️  MongoDB not connected - returning mock user data');

      const mockUsers = {
        'admin@aithena.com': {
          _id: '507f1f77bcf86cd799439011',
          name: 'System Administrator',
          email: 'admin@aithena.com',
          role: 'admin',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'waseem@aithena.com': {
          _id: '507f1f77bcf86cd799439012',
          name: 'Dr. Waseem',
          email: 'waseem@aithena.com',
          role: 'teacher',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'najeebullah@aithena.com': {
          _id: '507f1f77bcf86cd799439013',
          name: 'Najeebullah',
          email: 'najeebullah@aithena.com',
          role: 'teacher',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'rizwan@aithena.com': {
          _id: '507f1f77bcf86cd799439014',
          name: 'Rizwan',
          email: 'rizwan@aithena.com',
          role: 'teacher',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'sarah.johnson@aithena.com': {
          _id: '507f1f77bcf86cd799439015',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@aithena.com',
          role: 'teacher',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'moaz@aithena.com': {
          _id: '507f1f77bcf86cd799439016',
          name: 'Moaz',
          email: 'moaz@aithena.com',
          role: 'student',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'areeba@aithena.com': {
          _id: '507f1f77bcf86cd799439017',
          name: 'Areeba',
          email: 'areeba@aithena.com',
          role: 'student',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'ali@aithena.com': {
          _id: '507f1f77bcf86cd799439018',
          name: 'Ali',
          email: 'ali@aithena.com',
          role: 'student',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'ruman@aithena.com': {
          _id: '507f1f77bcf86cd799439019',
          name: 'Ruman',
          email: 'ruman@aithena.com',
          role: 'student',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        },
        'taha@aithena.com': {
          _id: '507f1f77bcf86cd799439020',
          name: 'Taha',
          email: 'taha@aithena.com',
          role: 'student',
          status: 'active',
          enrolledCourses: [],
          createdCourses: []
        }
      };

      const mockUser = mockUsers[req.user.email];
      if (!mockUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found (test mode)'
        });
      }

      return res.json({
        success: true,
        user: mockUser
      });
    }

    // Normal MongoDB query
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title description')
      .populate('createdCourses', 'title description');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
