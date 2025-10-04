import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  console.log('📧 Creating email transporter...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  });
};

/**
 * Send welcome email with credentials to new user
 * @param {string} recipientEmail - User's email address
 * @param {string} recipientName - User's name
 * @param {string} password - Generated password (plain text)
 * @param {string} role - User's role
 */
export const sendWelcomeEmail = async (recipientEmail, recipientName, password, role) => {
  try {
    console.log('🚀 sendWelcomeEmail called with:', { recipientEmail, recipientName, role });
    
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Expense Manager'}" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Welcome to Expense Manager - Your Account Credentials',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .credentials {
              background-color: #f0f0f0;
              padding: 15px;
              border-left: 4px solid #4CAF50;
              margin: 20px 0;
            }
            .credentials strong {
              color: #4CAF50;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 10px;
              margin: 15px 0;
              color: #856404;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Expense Manager!</h1>
            </div>
            <div class="content">
              <h2>Hello ${recipientName},</h2>
              <p>Your account has been successfully created. You can now access the Expense Manager system with the following credentials:</p>
              
              <div class="credentials">
                <p><strong>Email:</strong> ${recipientEmail}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
              </div>

              <p>Click the button below to access the login page:</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Login to Your Account</a>

              <p style="margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to contact your administrator.</p>

              <p>Best regards,<br>The Expense Manager Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Expense Manager!

Hello ${recipientName},

Your account has been successfully created. You can now access the Expense Manager system with the following credentials:

Email: ${recipientEmail}
Password: ${password}
Role: ${role.charAt(0).toUpperCase() + role.slice(1)}

⚠️ Security Notice: Please change your password after your first login for security purposes.

Login URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}/login

If you have any questions or need assistance, please don't hesitate to contact your administrator.

Best regards,
The Expense Manager Team

---
This is an automated email. Please do not reply to this message.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', recipientEmail);
    console.log('Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send password reset email
 * @param {string} recipientEmail - User's email address
 * @param {string} recipientName - User's name
 * @param {string} newPassword - New password
 */
export const sendPasswordResetEmail = async (recipientEmail, recipientName, newPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Expense Manager'}" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Your Password Has Been Reset - Expense Manager',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #2196F3;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .credentials {
              background-color: #f0f0f0;
              padding: 15px;
              border-left: 4px solid #2196F3;
              margin: 20px 0;
            }
            .credentials strong {
              color: #2196F3;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #2196F3;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 10px;
              margin: 15px 0;
              color: #856404;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hello ${recipientName},</h2>
              <p>Your password has been reset by your administrator. Your new login credentials are:</p>
              
              <div class="credentials">
                <p><strong>Email:</strong> ${recipientEmail}</p>
                <p><strong>New Password:</strong> ${newPassword}</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Please change your password immediately after logging in.
              </div>

              <p>Click the button below to access the login page:</p>
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Login to Your Account</a>

              <p style="margin-top: 30px;">If you did not request this password reset, please contact your administrator immediately.</p>

              <p>Best regards,<br>The Expense Manager Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Reset

Hello ${recipientName},

Your password has been reset by your administrator. Your new login credentials are:

Email: ${recipientEmail}
New Password: ${newPassword}

⚠️ Security Notice: Please change your password immediately after logging in.

Login URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}/login

If you did not request this password reset, please contact your administrator immediately.

Best regards,
The Expense Manager Team

---
This is an automated email. Please do not reply to this message.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully to:', recipientEmail);
    console.log('Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Test email configuration
 */
export const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};
