import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get all expenses for the user (filtered by role)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId, role, companyId } = req.user;
    const { status, startDate, endDate, category } = req.query;

    let query = `
      SELECT e.*, u.name as user_name, u.email as user_email
      FROM expenses e
      JOIN users u ON e.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    // Filter based on role
    if (role === 'employee') {
      query += ' AND e.user_id = ?';
      params.push(userId);
    } else if (role === 'admin') {
      query += ' AND e.company_id = ?';
      params.push(companyId);
    } else if (role === 'manager') {
      // Get expenses from employees under this manager
      query += ` AND e.user_id IN (
        SELECT employee_id FROM manager_relationships WHERE manager_id = ?
      )`;
      params.push(userId);
    }

    // Additional filters
    if (status) {
      query += ' AND e.status = ?';
      params.push(status);
    }
    if (startDate) {
      query += ' AND e.expense_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND e.expense_date <= ?';
      params.push(endDate);
    }
    if (category) {
      query += ' AND e.category = ?';
      params.push(category);
    }

    query += ' ORDER BY e.created_at DESC';

    const [expenses] = await pool.query(query, params);

    res.json({ expenses });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Server error fetching expenses' });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, companyId } = req.user;

    const [expenses] = await pool.query(
      `SELECT e.*, u.name as user_name, u.email as user_email,
              c.name as company_name, c.currency_code as company_currency
       FROM expenses e
       JOIN users u ON e.user_id = u.user_id
       JOIN companies c ON e.company_id = c.company_id
       WHERE e.expense_id = ?`,
      [id]
    );

    if (expenses.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const expense = expenses[0];

    // Check authorization
    if (role === 'employee' && expense.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (role === 'admin' && expense.company_id !== companyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get receipts
    const [receipts] = await pool.query(
      'SELECT * FROM expense_receipts WHERE expense_id = ?',
      [id]
    );

    // Get approval history
    const [approvals] = await pool.query(
      `SELECT ea.*, u.name as approver_name, u.email as approver_email
       FROM expense_approvals ea
       JOIN users u ON ea.approver_id = u.user_id
       WHERE ea.expense_id = ?
       ORDER BY ea.action_date DESC`,
      [id]
    );

    res.json({
      expense,
      receipts,
      approvals
    });

  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Server error fetching expense' });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', [
  authenticateToken,
  body('amount').isFloat({ min: 0.01 }),
  body('currencyCode').trim().notEmpty(),
  body('category').trim().notEmpty(),
  body('description').optional().trim(),
  body('expenseDate').isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, companyId } = req.user;
    const { amount, currencyCode, category, description, expenseDate } = req.body;

    // For now, we'll use the same amount for converted (in production, use currency conversion API)
    const amountConverted = amount;

    const [result] = await pool.query(
      `INSERT INTO expenses 
       (user_id, company_id, amount_original, currency_code, amount_converted, 
        category, description, expense_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, companyId, amount, currencyCode, amountConverted, category, description, expenseDate]
    );

    const expenseId = result.insertId;

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [userId, 'EXPENSE_CREATED', expenseId]
    );

    res.status(201).json({
      message: 'Expense created successfully',
      expenseId
    });

  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Server error creating expense' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('amount').optional().isFloat({ min: 0.01 }),
  body('category').optional().trim(),
  body('description').optional().trim(),
  body('expenseDate').optional().isDate()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Check if expense exists and user has permission
    const [expenses] = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = ?',
      [id]
    );

    if (expenses.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const expense = expenses[0];

    // Only the owner can update, and only if status is pending or rejected
    if (expense.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (expense.status === 'approved') {
      return res.status(400).json({ error: 'Cannot update approved expense' });
    }

    const { amount, currencyCode, category, description, expenseDate } = req.body;
    const updates = [];
    const params = [];

    if (amount !== undefined) {
      updates.push('amount_original = ?', 'amount_converted = ?');
      params.push(amount, amount);
    }
    if (currencyCode) {
      updates.push('currency_code = ?');
      params.push(currencyCode);
    }
    if (category) {
      updates.push('category = ?');
      params.push(category);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (expenseDate) {
      updates.push('expense_date = ?');
      params.push(expenseDate);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Reset status to pending if it was rejected
    if (expense.status === 'rejected') {
      updates.push('status = ?');
      params.push('pending');
    }

    params.push(id);

    await pool.query(
      `UPDATE expenses SET ${updates.join(', ')} WHERE expense_id = ?`,
      params
    );

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [userId, 'EXPENSE_UPDATED', id]
    );

    res.json({ message: 'Expense updated successfully' });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Server error updating expense' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    // Check if expense exists
    const [expenses] = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = ?',
      [id]
    );

    if (expenses.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const expense = expenses[0];

    // Only owner or admin can delete
    if (expense.user_id !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Cannot delete approved expenses
    if (expense.status === 'approved') {
      return res.status(400).json({ error: 'Cannot delete approved expense' });
    }

    await pool.query('DELETE FROM expenses WHERE expense_id = ?', [id]);

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [userId, 'EXPENSE_DELETED', id]
    );

    res.json({ message: 'Expense deleted successfully' });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Server error deleting expense' });
  }
});

export default router;
