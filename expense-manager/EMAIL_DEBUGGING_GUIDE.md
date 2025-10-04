# Email Debugging Guide

## Issue: Not Receiving Emails

Follow these steps to diagnose and fix email delivery issues.

---

## Step 1: Check Server Logs

### What to Look For:

When you create a user, you should see these logs in the server console:

```
📧 Attempting to send welcome email to: user@example.com
🚀 sendWelcomeEmail called with: { recipientEmail: 'user@example.com', recipientName: 'John Doe', role: 'employee' }
📧 Creating email transporter...
EMAIL_USER: ✅ Set
EMAIL_PASSWORD: ✅ Set
✅ Welcome email sent successfully to user@example.com
Message ID: <some-id@gmail.com>
```

### If You See:

**❌ "EMAIL_USER: ❌ Not set" or "EMAIL_PASSWORD: ❌ Not set"**
- Your `.env` file is not configured correctly
- Go to Step 2

**❌ "Failed to send welcome email: Invalid login"**
- Your Gmail credentials are incorrect
- Go to Step 3

**❌ "Failed to send welcome email: Connection timeout"**
- Network/firewall issue
- Go to Step 4

**❌ No email logs at all**
- The email function is not being called
- Go to Step 5

---

## Step 2: Verify .env Configuration

### Check .env File Location
The `.env` file must be in the `server` directory:
```
d:\Odoo_Codeforge\OdooXAmalthea-CodeForge-\expense-manager\server\.env
```

### Check .env File Contents
Open the `.env` file and verify it has these lines:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM_NAME=Expense Manager
CLIENT_URL=http://localhost:5173
```

### Common Issues:

❌ **Missing .env file**
- Copy `.env.example` to `.env`
- Add your Gmail credentials

❌ **Wrong file location**
- Must be in `server/.env`, not root directory

❌ **Typos in variable names**
- Must be exactly: `EMAIL_USER`, `EMAIL_PASSWORD` (case-sensitive)

❌ **Missing values**
- Both EMAIL_USER and EMAIL_PASSWORD must have values

### Fix:
1. Open `server/.env`
2. Add/update the email configuration
3. Save the file
4. **Restart the server** (important!)

---

## Step 3: Verify Gmail Credentials

### Test Your Credentials

Run the test script:
```bash
cd server
node test-email.js
```

This will verify your SMTP connection.

### Common Issues:

❌ **"Invalid login" error**
- You're using your Gmail password instead of App Password
- App Password is not correct

❌ **"Username and Password not accepted"**
- 2-Factor Authentication not enabled
- App Password expired or revoked

### Fix: Generate New App Password

1. **Enable 2FA on Gmail:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Expense Manager"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update .env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

4. **Restart server:**
   ```bash
   npm run dev
   ```

---

## Step 4: Check Network/Firewall

### Test SMTP Connection

Run this command to test if port 587 is accessible:
```bash
telnet smtp.gmail.com 587
```

If it fails, you have a network/firewall issue.

### Common Issues:

❌ **Corporate firewall blocking SMTP**
- Port 587 or 465 blocked
- Use VPN or different network

❌ **Antivirus blocking connection**
- Temporarily disable antivirus
- Add exception for Node.js

### Fix:
1. Check firewall settings
2. Try different network (mobile hotspot)
3. Contact IT if on corporate network

---

## Step 5: Verify API is Being Called

### Check if User Creation Works

1. **Create a user via API:**
   ```bash
   POST http://localhost:5000/api/users
   Authorization: Bearer <admin-token>
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "TestPass123",
     "role": "employee"
   }
   ```

2. **Check server console for logs:**
   - Should see: `📧 Attempting to send welcome email to: test@example.com`
   - If you don't see this, the route is not being hit

### Common Issues:

❌ **No logs at all**
- Server not running
- Wrong endpoint
- Authentication failed

❌ **User created but no email logs**
- Email code might be commented out
- Check `routes/users.js` line 117-126

### Fix:
1. Ensure server is running: `npm run dev`
2. Verify you're hitting the correct endpoint
3. Check authentication token is valid

---

## Step 6: Test Email Delivery

### Run the Test Script

```bash
cd server
node test-email.js
```

### What It Does:
1. Checks environment variables
2. Verifies SMTP connection
3. Sends a test email

### Expected Output:
```
=== Email Configuration Test ===

Environment Variables:
EMAIL_USER: your-email@gmail.com
EMAIL_PASSWORD: ✅ SET (hidden)
EMAIL_FROM_NAME: Expense Manager
CLIENT_URL: http://localhost:5173

Testing email configuration...

Test 1: Verifying SMTP connection...
✅ Email configuration is valid
✅ SMTP connection verified!

Test 2: Sending test email...
Sending test email to: test@example.com
🚀 sendWelcomeEmail called with: { recipientEmail: 'test@example.com', recipientName: 'Test User', role: 'employee' }
📧 Creating email transporter...
EMAIL_USER: ✅ Set
EMAIL_PASSWORD: ✅ Set
✅ Welcome email sent successfully to test@example.com

✅ Test email sent successfully!
Check inbox for: test@example.com
(Also check spam/junk folder)
```

---

## Step 7: Check Email Inbox

### Where to Look:

1. **Primary Inbox** - Check main inbox
2. **Spam/Junk Folder** - First emails often go here
3. **Promotions Tab** - Gmail might categorize it here
4. **All Mail** - Search for sender email

### Mark as Not Spam:
If email is in spam:
1. Open the email
2. Click "Not Spam" or "Report Not Spam"
3. Future emails will go to inbox

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Server is running (`npm run dev`)
- [ ] `.env` file exists in `server` directory
- [ ] `EMAIL_USER` is set in `.env`
- [ ] `EMAIL_PASSWORD` is set in `.env` (App Password, not Gmail password)
- [ ] 2FA is enabled on Gmail account
- [ ] App Password is valid (16 characters)
- [ ] Server restarted after updating `.env`
- [ ] Test script runs successfully (`node test-email.js`)
- [ ] User creation API works
- [ ] Server logs show email attempt
- [ ] Checked spam/junk folder
- [ ] No firewall blocking port 587

---

## Common Error Messages & Solutions

### "Invalid login: 535-5.7.8 Username and Password not accepted"
**Cause:** Using Gmail password instead of App Password  
**Fix:** Generate App Password and use that

### "Error: Missing credentials for 'PLAIN'"
**Cause:** EMAIL_USER or EMAIL_PASSWORD not set  
**Fix:** Add them to `.env` and restart server

### "ECONNREFUSED"
**Cause:** Cannot connect to Gmail SMTP server  
**Fix:** Check network/firewall, try different network

### "ETIMEDOUT"
**Cause:** Connection timeout  
**Fix:** Check firewall, antivirus, or network

### "No email logs in console"
**Cause:** Email function not being called  
**Fix:** Verify API endpoint and check `routes/users.js`

---

## Still Not Working?

### Manual Verification Steps:

1. **Verify nodemailer is installed:**
   ```bash
   npm list nodemailer
   ```
   Should show: `nodemailer@6.9.7`

2. **Check .env is loaded:**
   Add this to `server.js` temporarily:
   ```javascript
   console.log('EMAIL_USER:', process.env.EMAIL_USER);
   console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
   ```

3. **Test with a simple script:**
   Create `test-simple.js`:
   ```javascript
   import nodemailer from 'nodemailer';
   
   const transporter = nodemailer.createTransporter({
     service: 'gmail',
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-app-password'
     }
   });
   
   transporter.sendMail({
     from: 'your-email@gmail.com',
     to: 'recipient@example.com',
     subject: 'Test',
     text: 'Test email'
   }, (err, info) => {
     if (err) console.error(err);
     else console.log('Sent:', info.messageId);
   });
   ```

4. **Check Gmail account:**
   - Login to Gmail
   - Check "Sent" folder for sent emails
   - Check "Less secure apps" is not blocking (shouldn't be needed with App Password)

---

## Get Help

If still not working, collect this information:

1. **Server logs** (full output when creating user)
2. **Test script output** (`node test-email.js`)
3. **Environment check:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: Windows/Mac/Linux
4. **Error messages** (exact text)
5. **.env configuration** (hide password):
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=****
   ```

Then review the error messages or contact support with this information.

---

## Success Indicators

You'll know it's working when you see:

✅ Server logs show:
```
📧 Attempting to send welcome email to: user@example.com
✅ Welcome email sent successfully to user@example.com
```

✅ Test script passes all checks

✅ Email appears in recipient's inbox (or spam folder)

✅ User can login with credentials from email
