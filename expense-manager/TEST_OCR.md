# 🧪 OCR Testing Guide

## Quick Test Checklist

### ✅ Pre-Testing Setup

- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`cd expense-manager && npm install`)
- [ ] Database is running (MySQL)
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] Logged in as any user (admin/manager/employee)

---

## 🎯 Test 1: Basic OCR Scan

### Steps:
1. **Navigate to Submit Expense**
   - Click "Submit Expense" in sidebar
   - Page should load with form

2. **Open OCR Scanner**
   - Click "OCR Scan" button (blue button with scan icon)
   - Modal should open with upload area

3. **Upload Receipt**
   - Drag and drop an image OR click to browse
   - Use test image: `c:\Users\Admin\Desktop\Odoo\ocr\image.jpg`
   - Image preview should appear

4. **Scan Receipt**
   - Click "Scan Receipt" button
   - Progress indicator should show
   - Wait 5-10 seconds for processing

5. **Verify Results**
   - Check extracted data is displayed
   - Verify confidence score (should be > 70%)
   - Review amount, currency, date, merchant, category

6. **Use Data**
   - Click "Use This Data" button
   - Modal should close
   - Form should auto-fill with extracted values

### Expected Results:
- ✅ Amount field populated
- ✅ Currency selected
- ✅ Category selected (if detected)
- ✅ Date filled (if detected)
- ✅ Description contains merchant name

---

## 🎯 Test 2: API Endpoint Testing

### Test Scan Endpoint:

```bash
# Get your JWT token first (from browser localStorage or login response)
TOKEN="your_jwt_token_here"

# Test OCR scan
curl -X POST http://localhost:5000/api/ocr/scan \
  -H "Authorization: Bearer $TOKEN" \
  -F "receipt=@c:\Users\Admin\Desktop\Odoo\ocr\image.jpg"
```

### Expected Response:
```json
{
  "message": "Receipt scanned successfully",
  "data": {
    "amount": 45.50,
    "currency": "USD",
    "date": "2024-10-04",
    "merchant": "Store Name",
    "category": "Meals",
    "confidence": 92.5,
    "rawText": "..."
  },
  "file": {
    "filename": "image-1234567890.jpg",
    "path": "/uploads/image-1234567890.jpg",
    "size": 158170,
    "mimetype": "image/jpeg"
  }
}
```

---

## 🎯 Test 3: File Upload Validation

### Test Invalid File Type:

1. **Try uploading a PDF**
   - Should show error: "Only image files are allowed"

2. **Try uploading a text file**
   - Should be rejected

3. **Try uploading very large file (>10MB)**
   - Should show error: "File size too large"

### Expected Results:
- ✅ Only image files accepted
- ✅ File size limit enforced
- ✅ Clear error messages displayed

---

## 🎯 Test 4: Database Integration

### After uploading a receipt, check database:

```sql
-- Check if file was uploaded
SELECT * FROM expense_receipts 
ORDER BY uploaded_at DESC 
LIMIT 1;

-- Check OCR data
SELECT 
  receipt_id,
  expense_id,
  file_url,
  JSON_EXTRACT(ocr_data, '$.amount') as amount,
  JSON_EXTRACT(ocr_data, '$.currency') as currency,
  JSON_EXTRACT(ocr_data, '$.merchant') as merchant,
  JSON_EXTRACT(ocr_data, '$.confidence') as confidence,
  uploaded_at
FROM expense_receipts
ORDER BY uploaded_at DESC
LIMIT 5;

-- Check audit logs
SELECT * FROM audit_logs 
WHERE action = 'RECEIPT_UPLOADED'
ORDER BY created_at DESC
LIMIT 5;
```

### Expected Results:
- ✅ Receipt record created
- ✅ OCR data stored as JSON
- ✅ File URL points to uploads directory
- ✅ Audit log entry created

---

## 🎯 Test 5: Different Receipt Types

### Test with various receipts:

1. **Restaurant Receipt**
   - Should detect category: "Meals"
   - Should extract amount, date, merchant

2. **Gas Station Receipt**
   - Should detect category: "Transportation"
   - Should extract fuel amount

3. **Hotel Receipt**
   - Should detect category: "Accommodation"
   - Should extract total amount

4. **Uber/Taxi Receipt**
   - Should detect category: "Travel"
   - Should extract fare amount

### Tips for Better Results:
- Use clear, high-resolution images
- Ensure good lighting
- Keep receipt flat (no wrinkles)
- Center receipt in frame

---

## 🎯 Test 6: Error Handling

### Test error scenarios:

1. **No file selected**
   - Click "Scan Receipt" without uploading
   - Should show: "Please select a file first"

2. **Network error**
   - Stop backend server
   - Try to scan receipt
   - Should show: "Failed to process receipt"

3. **Corrupted image**
   - Upload a corrupted/invalid image
   - Should handle gracefully with error message

### Expected Results:
- ✅ User-friendly error messages
- ✅ No crashes or blank screens
- ✅ Ability to retry after error

---

## 🎯 Test 7: UI/UX Testing

### Check user experience:

1. **Drag and Drop**
   - Drag image onto upload area
   - Should highlight drop zone
   - Should accept and preview image

2. **Loading States**
   - During scan, button should show "Scanning Receipt..."
   - Spinner should be visible
   - Button should be disabled

3. **Confidence Meter**
   - Should display as progress bar
   - Should show percentage
   - Color should indicate quality (green = good)

4. **Responsive Design**
   - Test on mobile size (resize browser)
   - Modal should be scrollable
   - Buttons should be accessible

### Expected Results:
- ✅ Smooth animations
- ✅ Clear visual feedback
- ✅ Mobile-friendly layout
- ✅ Accessible controls

---

## 🎯 Test 8: Integration with Expense Submission

### Full workflow test:

1. **Scan receipt** using OCR
2. **Auto-fill form** with extracted data
3. **Review and adjust** values if needed
4. **Submit expense** (when backend route is ready)
5. **Verify** expense created with receipt attached

### Expected Results:
- ✅ Seamless workflow
- ✅ Data persists after scan
- ✅ Can manually override OCR data
- ✅ Receipt linked to expense

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to process receipt"

**Check:**
1. Backend server is running
2. Tesseract.js installed correctly
3. Sharp installed correctly
4. Image file is valid
5. Check server logs for details

**Solution:**
```bash
cd server
npm install tesseract.js sharp --save
npm run dev
```

### Issue: Low confidence score (<50%)

**Possible causes:**
- Blurry image
- Poor lighting
- Wrinkled receipt
- Faded text

**Solution:**
- Use higher quality image
- Retake photo with better lighting
- Flatten receipt before scanning

### Issue: Amount not detected

**Possible causes:**
- Amount not clearly visible
- Unusual format
- Multiple amounts on receipt

**Solution:**
- Manually enter amount
- Try different receipt image
- Check if "Total" label is visible

### Issue: "Cannot read property of undefined"

**Check:**
1. All dependencies installed
2. Backend routes registered
3. Frontend API calls correct
4. Token is valid

**Solution:**
```bash
# Reinstall dependencies
cd server
rm -rf node_modules
npm install

cd ..
rm -rf node_modules
npm install
```

---

## 📊 Performance Benchmarks

### Expected Processing Times:

| Receipt Size | Processing Time | Confidence |
|--------------|-----------------|------------|
| < 500KB      | 2-3 seconds     | 85-95%     |
| 500KB - 2MB  | 5-8 seconds     | 80-90%     |
| 2MB - 5MB    | 10-15 seconds   | 75-85%     |
| 5MB - 10MB   | 15-25 seconds   | 70-80%     |

### Optimization Tips:
- Compress images before upload
- Use JPEG instead of PNG
- Resize large images (max 2000px width)

---

## ✅ Success Criteria

OCR integration is successful if:

- [x] Can upload receipt images
- [x] OCR extracts text from image
- [x] Data parsing works (amount, currency, date)
- [x] Confidence score is displayed
- [x] Form auto-fills with extracted data
- [x] Receipts stored in database
- [x] File uploads saved to disk
- [x] Error handling works properly
- [x] UI is responsive and user-friendly
- [x] Audit logs created

---

## 🎓 Testing Best Practices

1. **Test with real receipts** from different merchants
2. **Try various image qualities** (good, medium, poor)
3. **Test different file formats** (JPG, PNG, etc.)
4. **Check mobile responsiveness**
5. **Verify database entries** after each test
6. **Monitor server logs** for errors
7. **Test error scenarios** (network issues, invalid files)
8. **Measure performance** (processing times)

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

Test Results:
[ ] Basic OCR scan works
[ ] API endpoints respond correctly
[ ] File validation works
[ ] Database integration works
[ ] Different receipt types handled
[ ] Error handling works
[ ] UI/UX is smooth
[ ] Full workflow completes

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🚀 Next Steps After Testing

Once all tests pass:

1. **Create sample receipts** for demo
2. **Train users** on OCR feature
3. **Monitor usage** and accuracy
4. **Collect feedback** from users
5. **Optimize** based on real-world usage
6. **Consider enhancements**:
   - Multi-language support
   - Batch processing
   - Mobile app integration
   - ML model training

---

**Happy Testing! 🧪**

For issues or questions, check:
- `OCR_INTEGRATION_GUIDE.md` - Full documentation
- Server logs - `server/` terminal output
- Browser console - F12 → Console tab
