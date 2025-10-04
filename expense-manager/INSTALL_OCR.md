# 🚀 OCR Installation Guide

## Quick Installation (Windows)

### Step 1: Install Backend Dependencies

```powershell
# Navigate to server directory
cd server

# Install new OCR dependencies
npm install multer tesseract.js sharp

# Verify installation
npm list multer tesseract.js sharp
```

### Step 2: Verify Directory Structure

The following files should exist:
```
server/
├── config/
│   ├── database.js
│   └── multer.js          ← NEW
├── services/
│   └── ocrService.js      ← NEW
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── expenses.js
│   ├── users.js
│   └── ocr.js             ← NEW
├── uploads/               ← NEW (auto-created)
│   └── .gitkeep
├── package.json           ← UPDATED
└── server.js              ← UPDATED

src/
├── components/
│   └── expenses/
│       └── ReceiptScanner.tsx  ← NEW
├── pages/
│   └── expenses/
│       └── SubmitExpense.tsx   ← UPDATED
└── services/
    └── api.ts             ← UPDATED
```

### Step 3: Test Installation

```powershell
# Start backend server
cd server
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully
🚀 Server is running on port 5000
📊 Environment: development
🔗 API URL: http://localhost:5000
💚 Health check: http://localhost:5000/health
```

### Step 4: Start Frontend

```powershell
# Open new terminal
cd expense-manager
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Verification Checklist

### ✅ Backend Verification

1. **Check dependencies installed:**
```powershell
cd server
npm list | findstr "multer tesseract sharp"
```

Should show:
```
├── multer@1.4.5-lts.1
├── tesseract.js@5.0.4
└── sharp@0.33.2
```

2. **Check uploads directory exists:**
```powershell
dir uploads
```

3. **Test health endpoint:**
```powershell
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Expense Manager API is running",
  "timestamp": "..."
}
```

### ✅ Frontend Verification

1. **Check component exists:**
```powershell
dir src\components\expenses\ReceiptScanner.tsx
```

2. **Open browser:**
   - Go to http://localhost:5173
   - Login
   - Navigate to "Submit Expense"
   - Look for "OCR Scan" button

---

## Troubleshooting

### Issue: npm install fails

**Error:** `Cannot find module 'sharp'`

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

### Issue: Sharp installation fails on Windows

**Error:** `sharp: Installation failed`

**Solution:**
```powershell
# Install Windows Build Tools (run as Administrator)
npm install --global windows-build-tools

# Then install sharp
npm install sharp --save
```

### Issue: Tesseract.js download fails

**Error:** `Failed to download language data`

**Solution:**
- Check internet connection
- Tesseract.js downloads language files on first use
- Wait for download to complete (may take 1-2 minutes)

### Issue: Uploads directory not created

**Solution:**
```powershell
# Manually create directory
mkdir server\uploads
echo. > server\uploads\.gitkeep
```

### Issue: Port 5000 already in use

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in server/.env
# PORT=5001
```

---

## Testing Installation

### Quick Test:

1. **Backend Test:**
```powershell
# Test OCR endpoint (requires login token)
curl -X POST http://localhost:5000/api/ocr/scan ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -F "receipt=@path\to\image.jpg"
```

2. **Frontend Test:**
   - Login to application
   - Go to Submit Expense
   - Click "OCR Scan"
   - Upload test image: `c:\Users\Admin\Desktop\Odoo\ocr\image.jpg`
   - Click "Scan Receipt"
   - Verify data extraction works

---

## Dependencies Overview

### Backend Dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| multer | ^1.4.5-lts.1 | File upload handling |
| tesseract.js | ^5.0.4 | OCR text extraction |
| sharp | ^0.33.2 | Image preprocessing |

### Installation Size:
- multer: ~500KB
- tesseract.js: ~2MB (+ language files ~10MB)
- sharp: ~30MB

**Total:** ~42MB additional space required

---

## Environment Variables

No new environment variables required! OCR works out of the box.

Optional configuration in `server/.env`:
```env
# Maximum file size (default: 10MB)
MAX_FILE_SIZE=10485760

# Uploads directory (default: ./uploads)
UPLOADS_DIR=./uploads

# OCR language (default: eng)
OCR_LANGUAGE=eng
```

---

## Post-Installation

### 1. Test with Sample Receipt

Use the test image from your ocr folder:
```
c:\Users\Admin\Desktop\Odoo\ocr\image.jpg
```

### 2. Check Server Logs

Watch for OCR processing messages:
```
Starting OCR for: uploads/image-1234567890.jpg
OCR Progress: 25%
OCR Progress: 50%
OCR Progress: 75%
OCR Progress: 100%
OCR completed successfully
```

### 3. Verify Database

```sql
-- Check if receipts table is ready
DESCRIBE expense_receipts;

-- Should show columns:
-- receipt_id, expense_id, file_url, ocr_data, uploaded_at
```

---

## Uninstallation (if needed)

To remove OCR feature:

```powershell
# Remove dependencies
cd server
npm uninstall multer tesseract.js sharp

# Remove files
Remove-Item services\ocrService.js
Remove-Item config\multer.js
Remove-Item routes\ocr.js
Remove-Item -Recurse uploads

# Revert server.js changes
# (remove ocr routes import and usage)
```

---

## Support

If you encounter issues:

1. **Check Documentation:**
   - `OCR_INTEGRATION_GUIDE.md` - Full guide
   - `TEST_OCR.md` - Testing procedures

2. **Check Logs:**
   - Backend: Server terminal output
   - Frontend: Browser console (F12)

3. **Verify Setup:**
   - Dependencies installed
   - Servers running
   - Database connected
   - Uploads directory exists

---

## Success Indicators

Installation is successful if:

✅ `npm install` completes without errors
✅ Backend starts without warnings
✅ Frontend compiles successfully
✅ "OCR Scan" button appears on Submit Expense page
✅ Can upload and scan a test receipt
✅ Extracted data displays correctly

---

**Installation Complete! 🎉**

Proceed to `TEST_OCR.md` for testing procedures.
