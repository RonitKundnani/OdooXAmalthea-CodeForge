import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.user_id, 
      email: user.email, 
      role: user.role,
      companyId: user.company_id 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Currency mapping based on country
const getCurrencyCode = (country) => {
  const currencyMap = {
    'United States': 'USD',
    'United Kingdom': 'GBP',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Germany': 'EUR',
    'France': 'EUR',
    'India': 'INR',
    'Japan': 'JPY',
    'Brazil': 'BRL',
    'Mexico': 'MXN',
    'Spain': 'EUR',
    'Italy': 'EUR'
  };
  return currencyMap[country] || 'USD';
};

// @route   POST /api/auth/signup
// @desc    Register new company and admin user
// @access  Public
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('companyName').trim().notEmpty(),
  body('country').trim().notEmpty()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, companyName, country } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Get currency code based on country
    const currencyCode = getCurrencyCode(country);

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Create company
      const [companyResult] = await connection.query(
        'INSERT INTO companies (name, country, currency_code) VALUES (?, ?, ?)',
        [companyName, country, currencyCode]
      );

      const companyId = companyResult.insertId;

      // Create admin user
      const [userResult] = await connection.query(
        'INSERT INTO users (company_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [companyId, name, email, passwordHash, 'admin']
      );

      const userId = userResult.insertId;

      // Log the action
      await connection.query(
        'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
        [userId, 'COMPANY_CREATED', companyId]
      );

      await connection.commit();
      connection.release();

      // Generate token
      const token = generateToken({
        user_id: userId,
        email,
        role: 'admin',
        company_id: companyId
      });

      res.status(201).json({
        message: 'Company and admin account created successfully',
        token,
        user: {
          userId,
          name,
          email,
          role: 'admin',
          companyId,
          companyName,
          country,
          currencyCode
        }
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with company info
    const [users] = await pool.query(
      `SELECT u.*, c.name as company_name, c.country, c.currency_code 
       FROM users u 
       LEFT JOIN companies c ON u.company_id = c.company_id 
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action) VALUES (?, ?)',
      [user.user_id, 'USER_LOGIN']
    );

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
        companyName: user.company_name,
        country: user.country,
        currencyCode: user.currency_code
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.role, u.company_id,
              c.name as company_name, c.country, c.currency_code
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.company_id
       WHERE u.user_id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    res.json({
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company_id,
        companyName: user.company_name,
        country: user.country,
        currencyCode: user.currency_code
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
