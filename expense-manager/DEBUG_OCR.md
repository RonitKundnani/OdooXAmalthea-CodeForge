# 🐛 OCR Debugging Guide - Amount Not Detected

## Issue: Amount not appearing in form after OCR scan

### Step-by-Step Debugging

---

## 1️⃣ Check Backend Logs

When you scan a receipt, watch the **backend terminal** for these logs:

```
=== Parsing OCR Text ===
Raw text length: 1234
First 200 chars: [text from receipt]
✅ Amount detected: 123.45 from pattern: /\$\s*(\d+[.,]\d{1,2})/
=== Parsed Data ===
Amount: 123.45
Currency: USD
Date: 2024-10-04
Merchant: Store Name
Category: Meals
==================
```

### What to Look For:

✅ **If you see "Amount detected":**
- Backend is working correctly
- Problem is in frontend
- Go to Step 2

❌ **If you see "No amount detected":**
- OCR couldn't find amount in text
- Check the "First 200 chars" output
- See "Improving Amount Detection" section below

---

## 2️⃣ Check Frontend Console

Open **Browser Console** (F12 → Console tab) and look for:

```
=== Data Extracted from OCR ===
Received data: {amount: 123.45, currency: "USD", ...}
Amount: 123.45
Currency: USD
Setting amount to: 123.45
```

### What to Look For:

✅ **If you see "Setting amount to: 123.45":**
- Data is being received
- Check if form input is updating
- See Step 3

❌ **If you see "No amount in data":**
- Backend didn't send amount
- Check backend response
- See Step 4

---

## 3️⃣ Check Form Input

After clicking "Use This Data":

1. **Inspect the amount input field**
2. **Check if value attribute is set**
3. **Try typing manually** - does it work?

### Possible Issues:

**Issue A: Input is disabled**
- Check if input has `disabled` attribute
- Remove if present

**Issue B: Value not updating**
- React state might not be updating
- Check React DevTools

**Issue C: Value is cleared immediately**
- Check for form reset logic
- Check useEffect dependencies

---

## 4️⃣ Check API Response

In **Browser Console → Network tab**:

1. **Find the POST request** to `/api/ocr/scan`
2. **Click on it**
3. **Go to Response tab**
4. **Check the JSON response**

### Expected Response:
```json
{
  "message": "Receipt scanned successfully",
  "data": {
    "amount": 123.45,    ← Should have a number here
    "currency": "USD",
    "date": "2024-10-04",
    "merchant": "Store Name",
    "category": "Meals",
    "confidence": 92.5,
    "rawText": "..."
  }
}
```

### If amount is null:
- Backend couldn't parse amount from OCR text
- Check backend logs for raw text
- See "Improving Amount Detection" below

---

## 🔧 Quick Fixes

### Fix 1: Restart Backend

```bash
# Stop backend (Ctrl+C)
cd server
npm run dev
```

### Fix 2: Clear Browser Cache

```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Fix 3: Check Image Quality

- Is the image clear?
- Is the amount visible?
- Try a different receipt image

### Fix 4: Manual Test

Test the OCR endpoint directly:

```bash
# Get your token from localStorage (browser console)
localStorage.getItem('token')

# Test with curl
curl -X POST http://localhost:5000/api/ocr/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "receipt=@c:\Users\Admin\Desktop\Odoo\ocr\image.jpg"
```

Check if response has `amount` field.

---

## 🎯 Improving Amount Detection

### If OCR text is extracted but amount not found:

1. **Check the raw text** in backend logs
2. **Look for the amount** manually
3. **Add custom pattern** if needed

### Example: Add Custom Pattern

Edit `server/services/ocrService.js`:

```javascript
const amountPatterns = [
  // ... existing patterns ...
  
  // Add your custom pattern based on your receipt format
  /your-custom-pattern-here/,
];
```

### Common Receipt Formats:

**Format 1: Amount with label**
```
Total: $123.45
Amount: 123.45
Sum: $123.45
```
Pattern: `/(?:total|amount|sum)[:\s]*\$?\s*(\d+[.,]\d{1,2})/i`

**Format 2: Amount with currency**
```
123.45 USD
$123.45
USD 123.45
```
Pattern: `/(\d+[.,]\d{1,2})\s*(?:USD|EUR|GBP|INR)/i`

**Format 3: Plain number**
```
123.45
123,45
1234.56
```
Pattern: `/\b(\d+[.,]\d{1,2})\b/`

---

## 🔍 Debug Checklist

Run through this checklist:

### Backend:
- [ ] Server is running on port 5000
- [ ] Dependencies installed (tesseract.js, sharp, multer)
- [ ] Uploads directory exists
- [ ] No errors in server logs
- [ ] OCR processing completes
- [ ] Amount is in parsed data

### Frontend:
- [ ] Frontend is running on port 5173
- [ ] Logged in successfully
- [ ] Submit Expense page loads
- [ ] "OCR Scan" button visible
- [ ] Modal opens when clicked
- [ ] File uploads successfully
- [ ] Scan completes without errors
- [ ] Data is displayed in modal
- [ ] "Use This Data" button works

### Browser:
- [ ] No console errors (F12)
- [ ] Network request succeeds (200 status)
- [ ] Response contains amount
- [ ] Form input updates

---

## 🧪 Test with Different Images

Try these test cases:

### Test 1: Simple Receipt
Create a test image with clear text:
```
Store Name
Date: 10/04/2024
Total: $45.50
```

### Test 2: Different Format
```
RESTAURANT ABC
Amount: 123.45 USD
Date: October 4, 2024
```

### Test 3: Your Image
Use: `c:\Users\Admin\Desktop\Odoo\ocr\image.jpg`

---

## 💡 Troubleshooting Tips

### Tip 1: Check Raw OCR Text

Add this to backend logs to see what OCR extracted:

```javascript
// In ocrService.js - already added
console.log('First 200 chars:', text.substring(0, 200));
```

### Tip 2: Test Amount Patterns

Test your patterns in JavaScript:

```javascript
const text = "Total: $123.45"; // Your OCR text
const pattern = /\$\s*(\d+[.,]\d{1,2})/;
const match = text.match(pattern);
console.log(match); // Should show the match
```

### Tip 3: Simplify Pattern

If complex patterns fail, use simple one:

```javascript
// Match any number with decimals
const match = text.match(/(\d+\.\d{2})/);
```

---

## 🔧 Manual Override

If OCR fails to detect amount, users can:

1. **View the raw text** in the scanner modal
2. **Manually enter** the amount in the form
3. **Still benefit** from other extracted data (date, category, etc.)

This is already implemented - the form is editable!

---

## 📊 Debug Output Example

### Good Output (Amount Detected):
```
Backend:
=== Parsing OCR Text ===
Raw text length: 245
First 200 chars: Store Name\nDate: 10/04/2024\nTotal: $45.50\n...
✅ Amount detected: 45.5 from pattern: /\$\s*(\d+[.,]\d{1,2})/
=== Parsed Data ===
Amount: 45.5
Currency: USD
==================

Frontend:
=== Data Extracted from OCR ===
Amount: 45.5
Setting amount to: 45.5
```

### Bad Output (Amount Not Detected):
```
Backend:
=== Parsing OCR Text ===
Raw text length: 180
First 200 chars: Store Name\nDate: 10/04/2024\n...
⚠️ No amount detected. Trying broader patterns...
=== Parsed Data ===
Amount: null
Currency: USD
==================

Frontend:
=== Data Extracted from OCR ===
Amount: null
⚠️ No amount in data
```

---

## 🚀 Quick Solution

**If amount is not being detected, try this:**

1. **Check backend logs** - What text was extracted?
2. **Look for the amount** in the raw text
3. **Add a specific pattern** for your receipt format
4. **Or manually enter** the amount (form is editable)

### Immediate Test:

```bash
# Restart backend with logging
cd server
npm run dev

# Upload receipt and watch logs
# You should see the OCR text and parsing results
```

---

## 📝 Report Template

If issue persists, provide this info:

```
1. Backend Log Output:
   [Paste the "=== Parsing OCR Text ===" section]

2. Frontend Console Output:
   [Paste the "=== Data Extracted from OCR ===" section]

3. Network Response:
   [Paste the JSON response from Network tab]

4. Receipt Content:
   What does the receipt say? (manually read the amount)

5. Expected Amount:
   What amount should be detected?
```

---

## ✅ Success Indicators

OCR is working correctly if you see:

✅ Backend logs show "Amount detected: X.XX"
✅ Frontend console shows "Setting amount to: X.XX"
✅ Amount input field is filled
✅ Can manually edit if needed

---

**Try the updated code and check the logs! The enhanced patterns should detect more amount formats. 🔍**
