# Email Setup Guide for Expense Manager

This guide will help you configure email functionality for sending user credentials when new users are added to the system.

## Overview

The Expense Manager system uses **Nodemailer** with Gmail SMTP to send automated emails to users when:
- A new user account is created (sends welcome email with login credentials)
- An admin resets a user's password (sends password reset email)

## Prerequisites

- A Gmail account for sending emails
- Gmail account with 2-Factor Authentication enabled
- Node.js and npm installed

## Step 1: Install Dependencies

The nodemailer package has already been added to `package.json`. Install it by running:

```bash
cd server
npm install
```

## Step 2: Configure Gmail App Password

Since Gmail requires App Passwords for third-party applications, follow these steps:

### 2.1 Enable 2-Factor Authentication

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** section
3. Enable **2-Step Verification** if not already enabled
4. Follow the prompts to set it up

### 2.2 Generate App Password

1. After enabling 2FA, go back to **Security** settings
2. Scroll down to **2-Step Verification** section
3. Click on **App passwords** (you may need to sign in again)
4. Select:
   - **App**: Mail
   - **Device**: Other (Custom name) - enter "Expense Manager"
5. Click **Generate**
6. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)
7. Save this password securely - you'll need it for the `.env` file

## Step 3: Configure Environment Variables

1. Navigate to the `server` directory
2. Copy the `.env.example` file to create your `.env` file:

```bash
cp .env.example .env
```

3. Open the `.env` file and update the email configuration:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM_NAME=Expense Manager
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with the App Password you generated

## Step 4: Test Email Configuration

The email service includes a test function. You can verify your configuration by:

1. Start your server:
```bash
npm run dev
```

2. The server will automatically verify the email configuration on startup

## Step 5: How It Works

### When Creating a New User

When an admin creates a new user via the `/api/users` endpoint:

1. User account is created in the database
2. Password is hashed and stored
3. A welcome email is automatically sent to the user's email address containing:
   - Their email (username)
   - Their plain-text password
   - Their role
   - A login link
   - Security reminder to change password

### When Resetting a Password

When an admin resets a user's password via `/api/users/:id/reset-password`:

1. Password is updated in the database
2. A password reset email is sent containing:
   - Their email
   - Their new password
   - A login link
   - Security warning

## Email Templates

The system includes professional HTML email templates with:
- Responsive design
- Clear credential display
- Security warnings
- Direct login links
- Plain text fallback for email clients that don't support HTML

## Troubleshooting

### Issue: "Invalid login" or "Authentication failed"

**Solution:**
- Ensure 2-Factor Authentication is enabled
- Verify you're using an App Password, not your regular Gmail password
- Check that EMAIL_USER matches the Gmail account that generated the App Password

### Issue: "Less secure app access"

**Solution:**
- Gmail no longer supports "less secure apps"
- You MUST use App Passwords with 2FA enabled
- Regular passwords will not work

### Issue: Emails not being received

**Solution:**
- Check spam/junk folder
- Verify the recipient email address is correct
- Check server logs for email sending errors
- Ensure your Gmail account is not blocked or suspended

### Issue: "Daily sending quota exceeded"

**Solution:**
- Gmail has a daily sending limit (typically 500 emails/day for regular accounts)
- For production use, consider using a dedicated email service like SendGrid, AWS SES, or Mailgun
- Implement rate limiting in your application

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use App Passwords** - Never use your actual Gmail password
3. **Rotate credentials** - Periodically regenerate App Passwords
4. **Monitor usage** - Check Gmail's sent folder regularly
5. **Limit access** - Only give email credentials to trusted team members

## Production Considerations

For production environments, consider:

1. **Using a dedicated email service:**
   - SendGrid
   - AWS SES (Simple Email Service)
   - Mailgun
   - Postmark

2. **Implementing email queues:**
   - Use Bull or Bee-Queue for background job processing
   - Prevents blocking API responses while sending emails

3. **Adding retry logic:**
   - Implement exponential backoff for failed email sends
   - Store failed emails for manual retry

4. **Email templates:**
   - Consider using template engines like Handlebars
   - Store templates in separate files for easier maintenance

## Customization

### Changing Email Templates

Edit the email templates in `server/services/emailService.js`:

- `sendWelcomeEmail()` - Welcome email template
- `sendPasswordResetEmail()` - Password reset email template

### Adding New Email Types

Create new functions in `emailService.js` following the existing pattern:

```javascript
export const sendCustomEmail = async (recipientEmail, data) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Your Subject',
    html: `Your HTML template`,
    text: `Your plain text version`
  };
  
  await transporter.sendMail(mailOptions);
};
```

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test your Gmail credentials manually
4. Review the [Nodemailer documentation](https://nodemailer.com/)

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Google 2-Step Verification](https://www.google.com/landing/2step/)
