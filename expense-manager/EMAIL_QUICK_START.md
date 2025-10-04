# Email Functionality - Quick Start

## What's Been Implemented

✅ **Nodemailer integration** for sending emails via Gmail SMTP  
✅ **Automated welcome emails** when admins create new users  
✅ **Password reset emails** when admins reset user passwords  
✅ **Professional HTML email templates** with responsive design  
✅ **Plain text fallback** for email clients that don't support HTML

## How It Works

### 1. When Creating a New User

**Admin Action:** POST `/api/users` with user details

**What Happens:**
1. User account is created in the database
2. Password is hashed and stored securely
3. **Email is automatically sent** to the new user with:
   - Their email (login username)
   - Their password (plain text, one-time)
   - Their role
   - Direct login link
   - Security reminder to change password

**Example Request:**
```bash
POST /api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "TempPass123",
  "role": "employee"
}
```

**Email Sent To:** john.doe@example.com  
**Email Contains:** Login credentials and welcome message

### 2. When Resetting a Password

**Admin Action:** POST `/api/users/:id/reset-password` with new password

**What Happens:**
1. User's password is updated in the database
2. **Email is automatically sent** to the user with:
   - Their email
   - Their new password
   - Direct login link
   - Security warning to change password immediately

**Example Request:**
```bash
POST /api/users/5/reset-password
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "newPassword": "NewSecurePass456"
}
```

**Email Sent To:** User's registered email  
**Email Contains:** New password and reset notification

## Setup Instructions (Quick)

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Gmail

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification
   - Click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

### Step 3: Update .env File

Add these variables to your `server/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM_NAME=Expense Manager
CLIENT_URL=http://localhost:5173
```

### Step 4: Start the Server
```bash
npm run dev
```

The email service will automatically verify the configuration on startup.

## Testing the Email Functionality

### Test 1: Create a New User

1. Login as admin
2. Create a new user via the UI or API
3. Check the user's email inbox for the welcome email
4. User can login with the credentials from the email

### Test 2: Reset a Password

1. Login as admin
2. Reset a user's password via the UI or API
3. Check the user's email inbox for the password reset email
4. User can login with the new password

## Email Templates Preview

### Welcome Email Includes:
- 🎉 Welcome header with company branding
- 📧 Email address (username)
- 🔑 Password (plain text)
- 👤 Role assignment
- ⚠️ Security notice to change password
- 🔗 Direct login button
- 📝 Support information

### Password Reset Email Includes:
- 🔄 Password reset notification
- 📧 Email address
- 🔑 New password
- ⚠️ Security warning
- 🔗 Direct login button
- 📝 Contact admin notice

## Important Notes

### Security Considerations

- ✅ Emails are sent asynchronously (won't block user creation)
- ✅ If email fails, user creation still succeeds (logged to console)
- ✅ Passwords are only sent once via email
- ⚠️ Users should change their password after first login
- ⚠️ Email credentials are stored in `.env` (never commit this file)

### Email Delivery

- **Development:** Uses Gmail SMTP (500 emails/day limit)
- **Production:** Consider using SendGrid, AWS SES, or Mailgun
- **Spam Folder:** First emails might go to spam, mark as "Not Spam"
- **Delivery Time:** Usually instant, but can take up to 1 minute

### Troubleshooting

**Email not received?**
1. Check spam/junk folder
2. Verify EMAIL_USER and EMAIL_PASSWORD in `.env`
3. Check server console for error messages
4. Ensure Gmail App Password is correct (not regular password)

**Authentication failed?**
1. Ensure 2-Factor Authentication is enabled on Gmail
2. Generate a new App Password
3. Use App Password, not your Gmail password

**Daily limit exceeded?**
- Gmail limits: 500 emails/day for regular accounts
- Solution: Use a dedicated email service for production

## Files Modified/Created

### New Files:
- `server/services/emailService.js` - Email service with Nodemailer
- `server/.env.example` - Environment variables template
- `EMAIL_SETUP_GUIDE.md` - Detailed setup instructions
- `EMAIL_QUICK_START.md` - This file

### Modified Files:
- `server/package.json` - Added nodemailer dependency
- `server/routes/users.js` - Added email sending on user creation and password reset
- `server/README.md` - Updated documentation

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure Gmail App Password
3. ✅ Update `.env` file with email credentials
4. ✅ Start server and test user creation
5. ✅ Verify email delivery
6. 📧 Users can login with emailed credentials

## For Detailed Setup

See the comprehensive [Email Setup Guide](./EMAIL_SETUP_GUIDE.md) for:
- Detailed Gmail configuration steps
- Production deployment considerations
- Email template customization
- Alternative email service providers
- Advanced troubleshooting

---

**Need Help?** Check the server console logs for detailed error messages when emails fail to send.
