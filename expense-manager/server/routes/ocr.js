import express from 'express';
import { upload, handleMulterError } from '../config/multer.js';
import { authenticateToken } from '../middleware/auth.js';
import { processReceipt, cleanupFile } from '../services/ocrService.js';
import { pool } from '../config/database.js';
import path from 'path';

const router = express.Router();

// @route   POST /api/ocr/scan
// @desc    Upload receipt image and extract data using OCR
// @access  Private
router.post('/scan', authenticateToken, upload.single('receipt'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.user;
    const filePath = req.file.path;

    console.log(`Processing receipt for user ${userId}: ${req.file.filename}`);

    // Process the receipt with OCR
    const extractedData = await processReceipt(filePath);

    // Return the extracted data
    res.json({
      message: 'Receipt scanned successfully',
      data: {
        amount: extractedData.amount,
        currency: extractedData.currency || 'USD',
        date: extractedData.date,
        merchant: extractedData.merchant,
        category: extractedData.category,
        confidence: extractedData.ocrConfidence,
        rawText: extractedData.ocrText
      },
      file: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('OCR scan error:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      await cleanupFile(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process receipt',
      details: error.message 
    });
  }
});

// @route   POST /api/ocr/upload-receipt
// @desc    Upload receipt and link to expense
// @access  Private
router.post('/upload-receipt', authenticateToken, upload.single('receipt'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId, companyId } = req.user;
    const { expenseId } = req.body;
    const filePath = req.file.path;
    const fileUrl = `/uploads/${req.file.filename}`;

    // If expenseId is provided, link receipt to existing expense
    if (expenseId) {
      // Verify expense belongs to user
      const [expenses] = await pool.query(
        'SELECT expense_id FROM expenses WHERE expense_id = ? AND user_id = ?',
        [expenseId, userId]
      );

      if (expenses.length === 0) {
        await cleanupFile(filePath);
        return res.status(404).json({ error: 'Expense not found or access denied' });
      }

      // Process receipt with OCR
      const extractedData = await processReceipt(filePath);

      // Store receipt in database
      const [result] = await pool.query(
        `INSERT INTO expense_receipts (expense_id, file_url, ocr_data)
         VALUES (?, ?, ?)`,
        [expenseId, fileUrl, JSON.stringify(extractedData)]
      );

      // Log the action
      await pool.query(
        'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
        [userId, 'RECEIPT_UPLOADED', result.insertId]
      );

      res.json({
        message: 'Receipt uploaded and linked to expense',
        receiptId: result.insertId,
        file: {
          filename: req.file.filename,
          url: fileUrl,
          size: req.file.size
        },
        extractedData: {
          amount: extractedData.amount,
          currency: extractedData.currency,
          date: extractedData.date,
          merchant: extractedData.merchant,
          category: extractedData.category,
          confidence: extractedData.ocrConfidence
        }
      });

    } else {
      // Just upload and process, don't link to expense yet
      const extractedData = await processReceipt(filePath);

      res.json({
        message: 'Receipt uploaded and processed',
        file: {
          filename: req.file.filename,
          url: fileUrl,
          size: req.file.size
        },
        extractedData: {
          amount: extractedData.amount,
          currency: extractedData.currency,
          date: extractedData.date,
          merchant: extractedData.merchant,
          category: extractedData.category,
          confidence: extractedData.ocrConfidence,
          rawText: extractedData.ocrText
        }
      });
    }

  } catch (error) {
    console.error('Upload receipt error:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      await cleanupFile(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to upload receipt',
      details: error.message 
    });
  }
});

// @route   GET /api/ocr/receipts/:expenseId
// @desc    Get all receipts for an expense
// @access  Private
router.get('/receipts/:expenseId', authenticateToken, async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { userId, role, companyId } = req.user;

    // Check if user has access to this expense
    let query = 'SELECT expense_id FROM expenses WHERE expense_id = ?';
    let params = [expenseId];

    if (role === 'employee') {
      query += ' AND user_id = ?';
      params.push(userId);
    } else if (role === 'admin') {
      query += ' AND company_id = ?';
      params.push(companyId);
    }

    const [expenses] = await pool.query(query, params);

    if (expenses.length === 0) {
      return res.status(404).json({ error: 'Expense not found or access denied' });
    }

    // Get receipts
    const [receipts] = await pool.query(
      'SELECT * FROM expense_receipts WHERE expense_id = ? ORDER BY uploaded_at DESC',
      [expenseId]
    );

    res.json({ receipts });

  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// @route   DELETE /api/ocr/receipts/:receiptId
// @desc    Delete a receipt
// @access  Private
router.delete('/receipts/:receiptId', authenticateToken, async (req, res) => {
  try {
    const { receiptId } = req.params;
    const { userId, role } = req.user;

    // Get receipt and verify ownership
    const [receipts] = await pool.query(
      `SELECT er.*, e.user_id 
       FROM expense_receipts er
       JOIN expenses e ON er.expense_id = e.expense_id
       WHERE er.receipt_id = ?`,
      [receiptId]
    );

    if (receipts.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const receipt = receipts[0];

    // Check permission
    if (role === 'employee' && receipt.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    if (receipt.file_url) {
      const filename = path.basename(receipt.file_url);
      const filePath = path.join(process.cwd(), 'uploads', filename);
      await cleanupFile(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM expense_receipts WHERE receipt_id = ?', [receiptId]);

    // Log the action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_id) VALUES (?, ?, ?)',
      [userId, 'RECEIPT_DELETED', receiptId]
    );

    res.json({ message: 'Receipt deleted successfully' });

  } catch (error) {
    console.error('Delete receipt error:', error);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
});

export default router;
