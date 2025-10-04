# Email Setup Checklist ✅

Follow this checklist to set up email functionality for sending user credentials.

## Prerequisites
- [ ] Gmail account available for sending emails
- [ ] Server code already has nodemailer installed
- [ ] Access to server `.env` file

---

## Step 1: Gmail Configuration

### Enable 2-Factor Authentication
- [ ] Go to [Google Account Settings](https://myaccount.google.com/)
- [ ] Click on **Security** in the left sidebar
- [ ] Find **2-Step Verification** section
- [ ] Click **Get Started** or **Turn On**
- [ ] Follow the prompts to set up 2FA (phone verification)
- [ ] Complete 2FA setup

### Generate App Password
- [ ] After 2FA is enabled, go back to **Security** settings
- [ ] Scroll down to **2-Step Verification** section
- [ ] Click on **App passwords** (may need to sign in again)
- [ ] Select app: **Mail**
- [ ] Select device: **Other (Custom name)**
- [ ] Enter name: **Expense Manager**
- [ ] Click **Generate**
- [ ] Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
- [ ] Save this password securely (you'll need it next)

---

## Step 2: Server Configuration

### Install Dependencies
- [ ] Open terminal/command prompt
- [ ] Navigate to server directory:
  ```bash
  cd d:\Odoo_Codeforge\OdooXAmalthea-CodeForge-\expense-manager\server
  ```
- [ ] Install nodemailer:
  ```bash
  npm install
  ```
- [ ] Wait for installation to complete

### Configure Environment Variables
- [ ] Open the `.env` file in the `server` directory
- [ ] Add or update these lines:
  ```env
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
  EMAIL_FROM_NAME=Expense Manager
  CLIENT_URL=http://localhost:5173
  ```
- [ ] Replace `your-email@gmail.com` with your Gmail address
- [ ] Replace `xxxx xxxx xxxx xxxx` with the App Password you copied
- [ ] Save the `.env` file
- [ ] **IMPORTANT:** Never commit `.env` to Git (it's already in `.gitignore`)

---

## Step 3: Test the Setup

### Start the Server
- [ ] In terminal, from the `server` directory, run:
  ```bash
  npm run dev
  ```
- [ ] Check console output for any errors
- [ ] Look for message: "Server is running on port 5000"

### Test Email Functionality

#### Option A: Via API (Using Postman/Thunder Client/curl)
- [ ] Login as admin to get JWT token
- [ ] Create a test user:
  ```bash
  POST http://localhost:5000/api/users
  Authorization: Bearer <your-admin-token>
  Content-Type: application/json
  
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "role": "employee"
  }
  ```
- [ ] Check server console for "Welcome email sent to: test@example.com"
- [ ] Check test@example.com inbox for welcome email

#### Option B: Via Frontend UI
- [ ] Login to the application as admin
- [ ] Navigate to User Management section
- [ ] Click "Add User" or similar button
- [ ] Fill in user details:
  - Name: Test User
  - Email: test@example.com (use a real email you can access)
  - Password: TestPass123
  - Role: Employee
- [ ] Submit the form
- [ ] Check for success message
- [ ] Check server console for email confirmation
- [ ] Check the email inbox for welcome email

### Verify Email Delivery
- [ ] Open the recipient's email inbox
- [ ] Look for email from your configured Gmail address
- [ ] Check spam/junk folder if not in inbox
- [ ] Open the email and verify it contains:
  - [ ] Welcome message
  - [ ] Email address (username)
  - [ ] Password
  - [ ] Role
  - [ ] Login button/link
  - [ ] Security notice

### Test Login with Emailed Credentials
- [ ] Copy the email and password from the received email
- [ ] Go to the login page
- [ ] Enter the credentials from the email
- [ ] Click login
- [ ] Verify successful login

---

## Step 4: Test Password Reset

### Reset a User's Password
- [ ] Login as admin
- [ ] Navigate to User Management
- [ ] Select a user
- [ ] Click "Reset Password"
- [ ] Enter new password: `NewPass456`
- [ ] Submit
- [ ] Check server console for "Password reset email sent"
- [ ] Check user's email inbox

### Verify Password Reset Email
- [ ] Open the password reset email
- [ ] Verify it contains:
  - [ ] Password reset notification
  - [ ] Email address
  - [ ] New password
  - [ ] Login button/link
  - [ ] Security warning

### Test Login with New Password
- [ ] Logout current user
- [ ] Login with the reset credentials
- [ ] Verify successful login

---

## Step 5: Production Considerations (Optional)

### For Production Deployment
- [ ] Consider using a dedicated email service:
  - [ ] SendGrid (100 emails/day free)
  - [ ] AWS SES (pay per email)
  - [ ] Mailgun (developer-friendly)
  - [ ] Postmark (transactional specialist)
- [ ] Update email service configuration in `emailService.js`
- [ ] Set up email monitoring and logging
- [ ] Implement email queue for high volume
- [ ] Configure SPF/DKIM records for better deliverability

---

## Troubleshooting

### ❌ Email Not Received
- [ ] Check spam/junk folder
- [ ] Verify EMAIL_USER in `.env` is correct
- [ ] Verify EMAIL_PASSWORD in `.env` is the App Password (not Gmail password)
- [ ] Check server console for error messages
- [ ] Ensure recipient email address is valid

### ❌ Authentication Failed Error
- [ ] Verify 2-Factor Authentication is enabled on Gmail
- [ ] Regenerate App Password and update `.env`
- [ ] Ensure you're using App Password, not regular Gmail password
- [ ] Restart the server after updating `.env`

### ❌ "Less Secure App" Error
- [ ] Gmail no longer supports less secure apps
- [ ] You MUST use App Passwords with 2FA
- [ ] Follow Step 1 to set up App Password correctly

### ❌ Daily Sending Limit Exceeded
- [ ] Gmail limits: 500 emails/day for regular accounts
- [ ] Wait 24 hours for limit to reset
- [ ] Consider using a dedicated email service for production

### ❌ Server Console Shows Email Error
- [ ] Check the exact error message in console
- [ ] Verify all environment variables are set
- [ ] Ensure nodemailer is installed: `npm list nodemailer`
- [ ] Restart the server: `npm run dev`

---

## Verification Checklist

### Final Verification
- [ ] Server starts without errors
- [ ] Email configuration is valid (check console on startup)
- [ ] Can create new users successfully
- [ ] Welcome emails are delivered
- [ ] Users can login with emailed credentials
- [ ] Password reset works
- [ ] Password reset emails are delivered
- [ ] Users can login with reset passwords
- [ ] Emails have professional appearance (HTML formatting)
- [ ] Login links in emails work correctly

---

## Documentation Reference

- **Detailed Setup Guide:** [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)
- **Quick Start:** [EMAIL_QUICK_START.md](./EMAIL_QUICK_START.md)
- **Implementation Summary:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Flow Diagrams:** [EMAIL_FLOW_DIAGRAM.md](./EMAIL_FLOW_DIAGRAM.md)
- **Server README:** [server/README.md](./server/README.md)

---

## Success Criteria ✅

You've successfully set up email functionality when:

1. ✅ Gmail App Password is configured
2. ✅ Environment variables are set in `.env`
3. ✅ Server starts without email errors
4. ✅ Creating a user sends a welcome email
5. ✅ User receives email with credentials
6. ✅ User can login with emailed credentials
7. ✅ Password reset sends an email
8. ✅ User receives password reset email
9. ✅ User can login with new password

---

**Need Help?**
- Check server console logs for detailed error messages
- Review the troubleshooting section above
- See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) for detailed instructions
- Check [Nodemailer documentation](https://nodemailer.com/)

**Status:** 
- [ ] Setup in progress
- [ ] Setup complete and tested
- [ ] Ready for production
