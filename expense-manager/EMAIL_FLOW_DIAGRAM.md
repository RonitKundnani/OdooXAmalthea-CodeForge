# Email Flow Diagram

## User Creation Flow with Email

```
┌─────────────┐
│   Admin     │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. POST /api/users
       │    { name, email, password, role }
       ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  (routes/users.js)                  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 1. Validate input             │ │
│  │ 2. Check if email exists      │ │
│  │ 3. Hash password (bcrypt)     │ │
│  │ 4. Insert into database       │ │
│  │ 5. Create audit log           │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 6. Call sendWelcomeEmail()    │ │
│  │    ↓                          │ │
│  │    services/emailService.js   │ │
│  │    ↓                          │ │
│  │    Create HTML template       │ │
│  │    ↓                          │ │
│  │    Send via Nodemailer        │ │
│  └───────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               │ 7. Email sent via SMTP
               ▼
        ┌──────────────┐
        │ Gmail SMTP   │
        │   Server     │
        └──────┬───────┘
               │
               │ 8. Deliver email
               ▼
        ┌──────────────┐
        │  New User's  │
        │  Email Inbox │
        └──────────────┘
               │
               │ 9. User reads email
               ▼
        ┌──────────────────────────┐
        │  Email Contains:         │
        │  • Email: user@email.com │
        │  • Password: TempPass123 │
        │  • Role: Employee        │
        │  • [Login Button]        │
        └──────────────────────────┘
               │
               │ 10. User clicks login
               ▼
        ┌──────────────┐
        │ Login Page   │
        │ (Frontend)   │
        └──────────────┘
```

## Password Reset Flow with Email

```
┌─────────────┐
│   Admin     │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. POST /api/users/:id/reset-password
       │    { newPassword }
       ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  (routes/users.js)                  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 1. Validate admin token       │ │
│  │ 2. Verify user exists         │ │
│  │ 3. Hash new password          │ │
│  │ 4. Update in database         │ │
│  │ 5. Create audit log           │ │
│  │ 6. Fetch user details         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 7. Call sendPasswordResetEmail│ │
│  │    ↓                          │ │
│  │    services/emailService.js   │ │
│  │    ↓                          │ │
│  │    Create HTML template       │ │
│  │    ↓                          │ │
│  │    Send via Nodemailer        │ │
│  └───────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               │ 8. Email sent via SMTP
               ▼
        ┌──────────────┐
        │ Gmail SMTP   │
        │   Server     │
        └──────┬───────┘
               │
               │ 9. Deliver email
               ▼
        ┌──────────────┐
        │    User's    │
        │  Email Inbox │
        └──────────────┘
               │
               │ 10. User reads email
               ▼
        ┌──────────────────────────┐
        │  Email Contains:         │
        │  • Email: user@email.com │
        │  • New Password: NewPass │
        │  • [Login Button]        │
        │  • Security Warning ⚠️   │
        └──────────────────────────┘
               │
               │ 11. User logs in with new password
               ▼
        ┌──────────────┐
        │ Login Page   │
        │ (Frontend)   │
        └──────────────┘
```

## Email Service Architecture

```
┌─────────────────────────────────────────────────────┐
│           services/emailService.js                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  createTransporter()                        │  │
│  │  ├── Service: Gmail                         │  │
│  │  ├── Auth: EMAIL_USER, EMAIL_PASSWORD       │  │
│  │  └── Returns: Nodemailer transporter        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  sendWelcomeEmail(email, name, pass, role)  │  │
│  │  ├── Creates HTML template                  │  │
│  │  ├── Creates plain text version             │  │
│  │  ├── Sends via transporter                  │  │
│  │  └── Returns: { success, messageId }        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  sendPasswordResetEmail(email, name, pass)  │  │
│  │  ├── Creates HTML template                  │  │
│  │  ├── Creates plain text version             │  │
│  │  ├── Sends via transporter                  │  │
│  │  └── Returns: { success, messageId }        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  testEmailConfig()                          │  │
│  │  └── Verifies SMTP connection               │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Email Template Structure

```
┌─────────────────────────────────────────┐
│         HTML Email Template             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │         HEADER (Green)            │ │
│  │    Welcome to Expense Manager!    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │          GREETING                 │ │
│  │      Hello [User Name],           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │       CREDENTIALS BOX             │ │
│  │  📧 Email: user@example.com       │ │
│  │  🔑 Password: TempPass123         │ │
│  │  👤 Role: Employee                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      SECURITY WARNING             │ │
│  │  ⚠️ Please change your password   │ │
│  │     after first login             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │      [Login to Your Account]      │ │
│  │         (Green Button)            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │          FOOTER                   │ │
│  │  This is an automated email       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Configuration Flow

```
┌─────────────┐
│   .env      │
│   File      │
└──────┬──────┘
       │
       │ Environment Variables
       │
       ├─→ EMAIL_USER=your-email@gmail.com
       ├─→ EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
       ├─→ EMAIL_FROM_NAME=Expense Manager
       └─→ CLIENT_URL=http://localhost:5173
       │
       ▼
┌─────────────────────────┐
│  dotenv.config()        │
│  (loads into process)   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  emailService.js        │
│  reads process.env      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Nodemailer             │
│  Transporter            │
│  (Gmail SMTP)           │
└─────────────────────────┘
```

## Error Handling Flow

```
User Creation Request
        │
        ▼
┌───────────────────┐
│ Create User in DB │
│   (CRITICAL)      │
└────────┬──────────┘
         │
         │ ✅ Success
         ▼
┌───────────────────┐     ❌ Email Fails
│  Send Email       │────────────────┐
│  (NON-CRITICAL)   │                │
└────────┬──────────┘                │
         │                           │
         │ ✅ Success                │
         ▼                           ▼
┌───────────────────┐     ┌──────────────────┐
│ Return Success    │     │ Log Error        │
│ User Created      │     │ Return Success   │
│ Email Sent ✉️     │     │ User Created     │
└───────────────────┘     │ Email Failed ⚠️  │
                          └──────────────────┘

Note: User creation ALWAYS succeeds
      Email is best-effort delivery
```

## Security Flow

```
Password Journey:
        
Admin Creates User
        │
        ▼
┌─────────────────────┐
│ Plain Text Password │
│  "TempPass123"      │
└──────────┬──────────┘
           │
           ├─────────────────────┐
           │                     │
           ▼                     ▼
    ┌─────────────┐      ┌─────────────┐
    │ Hash with   │      │ Send via    │
    │ bcrypt      │      │ Email       │
    │ (Database)  │      │ (One-time)  │
    └─────────────┘      └─────────────┘
           │                     │
           ▼                     ▼
    ┌─────────────┐      ┌─────────────┐
    │ Stored:     │      │ User reads  │
    │ $2a$10$...  │      │ TempPass123 │
    └─────────────┘      └─────────────┘
                                │
                                ▼
                         ┌─────────────┐
                         │ User logs   │
                         │ in and      │
                         │ changes it  │
                         └─────────────┘
```

## Integration Points

```
┌─────────────────────────────────────────────┐
│              Frontend (React)               │
│                                             │
│  Admin Dashboard                            │
│  ├── User Management Page                   │
│  │   ├── Add User Form                      │
│  │   │   └── Calls: POST /api/users         │
│  │   └── Reset Password                     │
│  │       └── Calls: POST /api/users/:id/... │
│  └── Shows success message                  │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP Request
                   ▼
┌─────────────────────────────────────────────┐
│              Backend (Express)              │
│                                             │
│  routes/users.js                            │
│  ├── Authenticates admin                    │
│  ├── Validates input                        │
│  ├── Creates/updates user                   │
│  └── Calls emailService                     │
│      │                                      │
│      └─→ services/emailService.js           │
│          └─→ Sends email via Nodemailer     │
└──────────────────┬──────────────────────────┘
                   │
                   │ SMTP
                   ▼
┌─────────────────────────────────────────────┐
│              Gmail SMTP Server              │
│                                             │
│  Receives email from Nodemailer             │
│  Delivers to recipient inbox                │
└─────────────────────────────────────────────┘
```

---

**Legend:**
- ✅ Success path
- ❌ Error path
- ⚠️ Warning/Notice
- 📧 Email
- 🔑 Password
- 👤 User
