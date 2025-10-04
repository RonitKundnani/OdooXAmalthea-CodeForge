import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/admin', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { companyId } = req.user;

    // Get total expenses count
    const [totalExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE company_id = ?',
      [companyId]
    );

    // Get pending expenses count
    const [pendingExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE company_id = ? AND status = ?',
      [companyId, 'pending']
    );

    // Get approved expenses count
    const [approvedExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE company_id = ? AND status = ?',
      [companyId, 'approved']
    );

    // Get rejected expenses count
    const [rejectedExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE company_id = ? AND status = ?',
      [companyId, 'rejected']
    );

    // Get total amount (approved expenses)
    const [totalAmount] = await pool.query(
      'SELECT SUM(amount_converted) as total FROM expenses WHERE company_id = ? AND status = ?',
      [companyId, 'approved']
    );

    // Get recent expenses with user details
    const [recentExpenses] = await pool.query(
      `SELECT e.expense_id, e.amount_original, e.currency_code, e.amount_converted,
              e.category, e.description, e.expense_date, e.status, e.created_at,
              u.name as user_name, u.email as user_email
       FROM expenses e
       JOIN users u ON e.user_id = u.user_id
       WHERE e.company_id = ?
       ORDER BY e.created_at DESC
       LIMIT 10`,
      [companyId]
    );

    // Get expenses by category
    const [expensesByCategory] = await pool.query(
      `SELECT category, COUNT(*) as count, SUM(amount_converted) as total
       FROM expenses
       WHERE company_id = ? AND status = 'approved'
       GROUP BY category
       ORDER BY total DESC`,
      [companyId]
    );

    // Get expenses by status over time (last 6 months)
    const [expensesTrend] = await pool.query(
      `SELECT 
         DATE_FORMAT(expense_date, '%Y-%m') as month,
         status,
         COUNT(*) as count,
         SUM(amount_converted) as total
       FROM expenses
       WHERE company_id = ? 
         AND expense_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY month, status
       ORDER BY month DESC`,
      [companyId]
    );

    // Get user statistics
    const [userStats] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE company_id = ?',
      [companyId]
    );

    // Get top spenders
    const [topSpenders] = await pool.query(
      `SELECT u.name, u.email, COUNT(e.expense_id) as expense_count, 
              SUM(e.amount_converted) as total_amount
       FROM users u
       LEFT JOIN expenses e ON u.user_id = e.user_id AND e.status = 'approved'
       WHERE u.company_id = ?
       GROUP BY u.user_id
       ORDER BY total_amount DESC
       LIMIT 5`,
      [companyId]
    );

    res.json({
      summary: {
        totalExpenses: totalExpenses[0].count,
        pendingExpenses: pendingExpenses[0].count,
        approvedExpenses: approvedExpenses[0].count,
        rejectedExpenses: rejectedExpenses[0].count,
        totalAmount: totalAmount[0].total || 0,
        totalUsers: userStats[0].count
      },
      recentExpenses,
      expensesByCategory,
      expensesTrend,
      topSpenders
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/dashboard/manager
// @desc    Get manager dashboard statistics
// @access  Private (Manager only)
router.get('/manager', authenticateToken, authorizeRole('manager'), async (req, res) => {
  try {
    const { userId, companyId } = req.user;

    // Get employees under this manager
    const [employees] = await pool.query(
      `SELECT u.user_id, u.name, u.email
       FROM manager_relationships mr
       JOIN users u ON mr.employee_id = u.user_id
       WHERE mr.manager_id = ?`,
      [userId]
    );

    const employeeIds = employees.map(e => e.user_id);

    if (employeeIds.length === 0) {
      return res.json({
        summary: {
          totalExpenses: 0,
          pendingApprovals: 0,
          approvedExpenses: 0,
          rejectedExpenses: 0,
          totalAmount: 0
        },
        pendingExpenses: [],
        recentExpenses: [],
        employees: []
      });
    }

    // Get pending approvals for this manager
    const [pendingApprovals] = await pool.query(
      `SELECT COUNT(*) as count
       FROM expense_approvals ea
       JOIN expenses e ON ea.expense_id = e.expense_id
       WHERE ea.approver_id = ? AND ea.status = 'pending'`,
      [userId]
    );

    // Get total expenses from team
    const [totalExpenses] = await pool.query(
      `SELECT COUNT(*) as count FROM expenses WHERE user_id IN (?)`,
      [employeeIds]
    );

    // Get approved expenses
    const [approvedExpenses] = await pool.query(
      `SELECT COUNT(*) as count FROM expenses WHERE user_id IN (?) AND status = 'approved'`,
      [employeeIds]
    );

    // Get rejected expenses
    const [rejectedExpenses] = await pool.query(
      `SELECT COUNT(*) as count FROM expenses WHERE user_id IN (?) AND status = 'rejected'`,
      [employeeIds]
    );

    // Get total amount
    const [totalAmount] = await pool.query(
      `SELECT SUM(amount_converted) as total FROM expenses WHERE user_id IN (?) AND status = 'approved'`,
      [employeeIds]
    );

    // Get pending expenses for approval
    const [pendingExpensesList] = await pool.query(
      `SELECT e.expense_id, e.amount_original, e.currency_code, e.amount_converted,
              e.category, e.description, e.expense_date, e.status, e.created_at,
              u.name as user_name, u.email as user_email,
              ea.approval_id, ea.step_id
       FROM expense_approvals ea
       JOIN expenses e ON ea.expense_id = e.expense_id
       JOIN users u ON e.user_id = u.user_id
       WHERE ea.approver_id = ? AND ea.status = 'pending'
       ORDER BY e.created_at DESC`,
      [userId]
    );

    // Get recent expenses from team
    const [recentExpenses] = await pool.query(
      `SELECT e.expense_id, e.amount_original, e.currency_code, e.amount_converted,
              e.category, e.description, e.expense_date, e.status, e.created_at,
              u.name as user_name, u.email as user_email
       FROM expenses e
       JOIN users u ON e.user_id = u.user_id
       WHERE e.user_id IN (?)
       ORDER BY e.created_at DESC
       LIMIT 10`,
      [employeeIds]
    );

    res.json({
      summary: {
        totalExpenses: totalExpenses[0].count,
        pendingApprovals: pendingApprovals[0].count,
        approvedExpenses: approvedExpenses[0].count,
        rejectedExpenses: rejectedExpenses[0].count,
        totalAmount: totalAmount[0].total || 0
      },
      pendingExpenses: pendingExpensesList,
      recentExpenses,
      employees
    });

  } catch (error) {
    console.error('Manager dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/dashboard/employee
// @desc    Get employee dashboard statistics
// @access  Private (Employee only)
router.get('/employee', authenticateToken, authorizeRole('employee'), async (req, res) => {
  try {
    const { userId } = req.user;

    // Get total expenses
    const [totalExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = ?',
      [userId]
    );

    // Get pending expenses
    const [pendingExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = ? AND status = ?',
      [userId, 'pending']
    );

    // Get approved expenses
    const [approvedExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = ? AND status = ?',
      [userId, 'approved']
    );

    // Get rejected expenses
    const [rejectedExpenses] = await pool.query(
      'SELECT COUNT(*) as count FROM expenses WHERE user_id = ? AND status = ?',
      [userId, 'rejected']
    );

    // Get total amount (approved)
    const [totalAmount] = await pool.query(
      'SELECT SUM(amount_converted) as total FROM expenses WHERE user_id = ? AND status = ?',
      [userId, 'approved']
    );

    // Get recent expenses
    const [recentExpenses] = await pool.query(
      `SELECT expense_id, amount_original, currency_code, amount_converted,
              category, description, expense_date, status, created_at
       FROM expenses
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    // Get expenses by category
    const [expensesByCategory] = await pool.query(
      `SELECT category, COUNT(*) as count, SUM(amount_converted) as total
       FROM expenses
       WHERE user_id = ?
       GROUP BY category
       ORDER BY total DESC`,
      [userId]
    );

    res.json({
      summary: {
        totalExpenses: totalExpenses[0].count,
        pendingExpenses: pendingExpenses[0].count,
        approvedExpenses: approvedExpenses[0].count,
        rejectedExpenses: rejectedExpenses[0].count,
        totalAmount: totalAmount[0].total || 0
      },
      recentExpenses,
      expensesByCategory
    });

  } catch (error) {
    console.error('Employee dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

export default router;
