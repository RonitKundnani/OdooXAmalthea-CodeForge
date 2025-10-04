import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users in the company (Admin only)
// @access  Private (Admin)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { companyId } = req.user;

    const [users] = await pool.query(
      `SELECT user_id, name, email, role, created_at 
       FROM users 
       WHERE company_id = ?
       ORDER BY created_at DESC`,
      [companyId]
    );

    res.json({ users });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private (Admin)
router.get('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const [users] = await pool.query(
      `SELECT user_id, name, email, role, created_at
       FROM users
       WHERE user_id = ? AND company_id = ?`,
      [id, companyId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
});

// @route   POST /api/users
// @desc    Create new user (Admin only)
// @access  Private (Admin)
router.post('/', [
  authenticateToken,
  authorizeRole('admin'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'manager', 'employee']).withMessage('Invalid role')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyId, userId: adminUserId } = req.user;
    const { name, email, password, role } = req.body;

    // Check if email already exists in the company
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

    // Create user
    const [result] = await pool.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [companyId, name, email, passwordHash, role]
    );

    const newUserId = result.insertId;

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [adminUserId, 'USER_CREATED', newUserId]
    );

    // Return the created user (without password)
    const [newUser] = await pool.query(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?',
      [newUserId]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error creating user' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/:id', [
  authenticateToken,
  authorizeRole('admin'),
  body('name').optional().trim().notEmpty(),
  body('role').optional().isIn(['admin', 'manager', 'employee'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { companyId, userId: adminUserId } = req.user;
    const { name, role } = req.body;

    // Check if user exists and belongs to the same company
    const [users] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ? AND company_id = ?',
      [id, companyId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update query
    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (role) {
      updates.push('role = ?');
      params.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      params
    );

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [adminUserId, 'USER_UPDATED', id]
    );

    // Return updated user
    const [updatedUser] = await pool.query(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?',
      [id]
    );

    res.json({
      message: 'User updated successfully',
      user: updatedUser[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error updating user' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId: adminUserId } = req.user;

    // Check if user exists and belongs to the same company
    const [users] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ? AND company_id = ?',
      [id, companyId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (parseInt(id) === adminUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete user (cascade will handle related records)
    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [adminUserId, 'USER_DELETED', id]
    );

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// @route   POST /api/users/:id/reset-password
// @desc    Reset user password (Admin only)
// @access  Private (Admin)
router.post('/:id/reset-password', [
  authenticateToken,
  authorizeRole('admin'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { companyId, userId: adminUserId } = req.user;
    const { newPassword } = req.body;

    // Check if user exists and belongs to the same company
    const [users] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ? AND company_id = ?',
      [id, companyId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [passwordHash, id]
    );

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [adminUserId, 'PASSWORD_RESET', id]
    );

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
});

export default router;
