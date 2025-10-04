// Quick OCR Test Script
// Run this to test OCR locally without the full server

import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your test image
const imagePath = 'C:\\Users\\Admin\\Desktop\\Odoo\\ocr\\image.jpg';

console.log('🔍 Testing OCR with image:', imagePath);
console.log('=====================================\n');

async function testOCR() {
  try {
    // Step 1: Preprocess image
    console.log('📸 Step 1: Preprocessing image...');
    const processedBuffer = await sharp(imagePath)
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
    console.log('✅ Image preprocessed\n');

    // Step 2: Extract text with OCR
    console.log('🔤 Step 2: Extracting text with OCR...');
    const result = await Tesseract.recognize(
      processedBuffer,
      'eng',
      {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            process.stdout.write(`\rProgress: ${Math.round(info.progress * 100)}%`);
          }
        }
      }
    );
    console.log('\n✅ Text extracted\n');

    // Step 3: Display results
    console.log('📊 OCR Results:');
    console.log('=====================================');
    console.log('Confidence:', Math.round(result.data.confidence) + '%');
    console.log('Words detected:', result.data.words.length);
    console.log('Lines detected:', result.data.lines.length);
    console.log('\n📝 Extracted Text:');
    console.log('=====================================');
    console.log(result.data.text);
    console.log('=====================================\n');

    // Step 4: Parse amount
    console.log('💰 Step 4: Parsing amount...');
    const text = result.data.text;
    
    const amountPatterns = [
      { name: 'Dollar sign format', pattern: /\$\s*(\d+[.,]\d{1,2})/ },
      { name: 'Currency code format', pattern: /(\d+[.,]\d{1,2})\s*(?:USD|EUR|GBP|INR)/i },
      { name: 'Total label format', pattern: /(?:total|amount|sum|price|cost)[:\s]*\$?\s*(\d+[.,]\d{1,2})/i },
      { name: 'Rupee format', pattern: /(?:rs|₹)\s*(\d+[.,]?\d*)/i },
      { name: 'Word format', pattern: /(\d+[.,]\d{1,2})\s*(?:dollars?|euros?|pounds?|rupees?)/i },
      { name: 'Any decimal number', pattern: /\b(\d+[.,]\d{1,2})\b/ },
      { name: 'Any integer', pattern: /\b(\d+)\b/ }
    ];

    let amountFound = false;
    for (const { name, pattern } of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        let amountStr = match[1].replace(/[^\d.,]/g, '');
        amountStr = amountStr.replace(',', '.');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
          console.log(`✅ Amount detected: ${amount} (using ${name})`);
          amountFound = true;
          break;
        }
      }
    }

    if (!amountFound) {
      console.log('❌ No amount detected in text');
      console.log('\n💡 Suggestions:');
      console.log('1. Check if amount is visible in extracted text above');
      console.log('2. Image quality might be too low');
      console.log('3. Amount might be in unusual format');
      console.log('4. Try a clearer image or different receipt');
    }

    console.log('\n🎉 Test Complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check if image file exists at:', imagePath);
    console.log('2. Ensure tesseract.js and sharp are installed');
    console.log('3. Try: npm install tesseract.js sharp');
  }
}

// Run the test
testOCR();
