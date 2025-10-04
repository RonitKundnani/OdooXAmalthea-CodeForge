import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Preprocess image for better OCR results
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Buffer>} - Processed image buffer
 */
export const preprocessImage = async (imagePath) => {
  try {
    const processedBuffer = await sharp(imagePath)
      .grayscale() // Convert to grayscale
      .normalize() // Normalize contrast
      .sharpen() // Sharpen the image
      .toBuffer();
    
    return processedBuffer;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    throw new Error('Failed to preprocess image');
  }
};

/**
 * Extract text from image using Tesseract OCR
 * @param {string} imagePath - Path to the image file
 * @param {string} language - Language code (default: 'eng')
 * @returns {Promise<Object>} - OCR result with text and confidence
 */
export const extractTextFromImage = async (imagePath, language = 'eng') => {
  try {
    console.log(`Starting OCR for: ${imagePath}`);
    
    // Preprocess the image
    const processedBuffer = await preprocessImage(imagePath);
    
    // Perform OCR
    const result = await Tesseract.recognize(
      processedBuffer,
      language,
      {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`);
          }
        }
      }
    );

    console.log('OCR completed successfully');
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      words: result.data.words.length,
      lines: result.data.lines.length
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Parse expense data from OCR text
 * @param {string} text - Extracted text from OCR
 * @returns {Object} - Parsed expense data
 */
export const parseExpenseData = (text) => {
  console.log('=== Parsing OCR Text ===');
  console.log('Raw text length:', text.length);
  console.log('First 200 chars:', text.substring(0, 200));
  
  const data = {
    amount: null,
    currency: null,
    date: null,
    merchant: null,
    category: null,
    rawText: text
  };

  try {
    // Extract amount (looks for patterns like $123.45, 123.45, etc.)
    const amountPatterns = [
      /\$\s*(\d+[.,]\d{1,2})/,           // $123.45 or $123.4
      /(\d+[.,]\d{1,2})\s*(?:USD|EUR|GBP|INR|CAD|AUD|JPY|CNY)/i, // 123.45 USD
      /(?:total|amount|sum|price|cost|charge)[:\s]*\$?\s*(\d+[.,]\d{1,2})/i, // Total: $123.45
      /(?:rs|₹)\s*(\d+[.,]?\d*)/i,       // Rs 123 or ₹123.45
      /(\d+[.,]\d{1,2})\s*(?:dollars?|euros?|pounds?|rupees?)/i, // 123.45 dollars
      /\$?\s*(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})/,  // 1,234.56 or 1.234,56
      /(\d+)\s*(?:USD|EUR|GBP|INR)/i,    // 123 USD (no decimals)
      /\b(\d+[.,]\d{1,2})\b/             // 123.45 (fallback - any number with decimals)
    ];

    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Clean up the matched amount
        let amountStr = match[1].replace(/[^\d.,]/g, '');
        // Handle both comma and dot as decimal separator
        if (amountStr.includes(',') && amountStr.includes('.')) {
          // European format: 1.234,56 -> 1234.56
          amountStr = amountStr.replace(/\./g, '').replace(',', '.');
        } else if (amountStr.includes(',')) {
          // Could be 1,234.56 or 123,45
          const parts = amountStr.split(',');
          if (parts[1] && parts[1].length === 2) {
            // Likely decimal: 123,45 -> 123.45
            amountStr = amountStr.replace(',', '.');
          } else {
            // Likely thousands: 1,234 -> 1234
            amountStr = amountStr.replace(/,/g, '');
          }
        }
        data.amount = parseFloat(amountStr);
        if (!isNaN(data.amount) && data.amount > 0) {
          console.log('✅ Amount detected:', data.amount, 'from pattern:', pattern);
          break;
        }
      }
    }
    
    if (!data.amount) {
      console.log('⚠️ No amount detected. Trying broader patterns...');
      // Try even broader pattern - any number
      const broadMatch = text.match(/\b(\d+)\b/);
      if (broadMatch) {
        data.amount = parseFloat(broadMatch[1]);
        console.log('✅ Amount detected (broad match):', data.amount);
      }
    }

    // Extract currency
    const currencyMatch = text.match(/\b(USD|EUR|GBP|INR|CAD|AUD|JPY|CNY)\b/i);
    if (currencyMatch) {
      data.currency = currencyMatch[1].toUpperCase();
    } else if (text.includes('$')) {
      data.currency = 'USD';
    } else if (text.includes('€')) {
      data.currency = 'EUR';
    } else if (text.includes('£')) {
      data.currency = 'GBP';
    } else if (text.includes('₹')) {
      data.currency = 'INR';
    }

    // Extract date (various formats)
    const datePatterns = [
      /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,     // 12/31/2024 or 31-12-2024
      /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/,       // 2024-12-31
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i, // January 15, 2024
      /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i    // 15 January 2024
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.date = match[0];
        break;
      }
    }

    // Extract merchant name (first line or line with common merchant keywords)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      // Try to find merchant name (usually in first few lines)
      for (let i = 0; i < Math.min(3, lines.length); i++) {
        const line = lines[i].trim();
        if (line.length > 3 && line.length < 50 && !line.match(/^\d+/)) {
          data.merchant = line;
          break;
        }
      }
    }

    // Detect category based on keywords
    const categoryKeywords = {
      'Travel': ['taxi', 'uber', 'lyft', 'flight', 'hotel', 'airline', 'airport', 'train', 'bus'],
      'Meals': ['restaurant', 'cafe', 'coffee', 'food', 'dining', 'lunch', 'dinner', 'breakfast'],
      'Office Supplies': ['office', 'supplies', 'stationery', 'paper', 'pen', 'printer'],
      'Transportation': ['gas', 'fuel', 'parking', 'toll', 'metro', 'subway'],
      'Accommodation': ['hotel', 'motel', 'inn', 'lodge', 'resort', 'airbnb'],
      'Entertainment': ['movie', 'cinema', 'theater', 'concert', 'event'],
      'Technology': ['electronics', 'computer', 'software', 'hardware', 'tech']
    };

    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        data.category = category;
        break;
      }
    }

  } catch (error) {
    console.error('Error parsing expense data:', error);
  }

  console.log('=== Parsed Data ===');
  console.log('Amount:', data.amount);
  console.log('Currency:', data.currency);
  console.log('Date:', data.date);
  console.log('Merchant:', data.merchant);
  console.log('Category:', data.category);
  console.log('==================');

  return data;
};

/**
 * Process receipt image and extract expense data
 * @param {string} imagePath - Path to the receipt image
 * @returns {Promise<Object>} - Extracted and parsed expense data
 */
export const processReceipt = async (imagePath) => {
  try {
    // Extract text using OCR
    const ocrResult = await extractTextFromImage(imagePath);
    
    // Parse expense data from text
    const expenseData = parseExpenseData(ocrResult.text);
    
    return {
      ...expenseData,
      ocrConfidence: ocrResult.confidence,
      ocrText: ocrResult.text,
      wordsDetected: ocrResult.words,
      linesDetected: ocrResult.lines
    };
  } catch (error) {
    console.error('Receipt processing error:', error);
    throw error;
  }
};

/**
 * Clean up temporary files
 * @param {string} filePath - Path to file to delete
 */
export const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Cleaned up file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to cleanup file ${filePath}:`, error);
  }
};
