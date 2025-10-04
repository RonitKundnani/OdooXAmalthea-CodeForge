# Expense Manager - Backend Server

Backend API server for the Expense Management System built with Node.js, Express, and MySQL.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Admin, Manager, and Employee roles
- **RESTful API**: Clean and organized API endpoints
- **MySQL Database**: Robust relational database structure
- **Secure**: Password hashing, JWT tokens, and input validation
- **Audit Logging**: Track all important actions
- **Email Notifications**: Automated email delivery with user credentials via Nodemailer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Database Setup

Create the MySQL database and tables using the provided schema:

```bash
# Login to MySQL
mysql -u root -p

# Run the database schema
source path/to/database_schema.sql
```

Or manually execute the SQL commands:

```sql
CREATE DATABASE expense_management;
USE expense_management;

-- Then run all the CREATE TABLE statements from the schema
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=expense_management
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Secret (Change this to a random string in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM_NAME=Expense Manager
```

**⚠️ IMPORTANT**: 
- Change the `JWT_SECRET` to a strong random string in production!
- For email setup, see the [Email Setup Guide](../EMAIL_SETUP_GUIDE.md) for detailed instructions on configuring Gmail

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MySQL connection pool configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes (login/signup)
│   ├── dashboard.js         # Dashboard data routes
│   ├── expenses.js          # Expense CRUD routes
│   └── users.js             # User management routes
├── services/
│   └── emailService.js      # Email notification service
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new company and admin | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user info | Private |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/admin` | Get admin dashboard data | Admin |
| GET | `/api/dashboard/manager` | Get manager dashboard data | Manager |
| GET | `/api/dashboard/employee` | Get employee dashboard data | Employee |

### Expenses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/expenses` | Get all expenses (filtered by role) | Private |
| GET | `/api/expenses/:id` | Get single expense | Private |
| POST | `/api/expenses` | Create new expense | Private |
| PUT | `/api/expenses/:id` | Update expense | Private |
| DELETE | `/api/expenses/:id` | Delete expense | Private |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users in company | Admin |
| GET | `/api/users/:id` | Get single user | Admin |
| POST | `/api/users` | Create new user (sends email) | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| POST | `/api/users/:id/reset-password` | Reset user password (sends email) | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Example Response

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "name": "John Doe",
    "email": "admin@example.com",
    "role": "admin",
    "companyId": 1,
    "companyName": "Acme Corp",
    "country": "United States",
    "currencyCode": "USD"
  }
}
```

## 👥 User Roles

### Admin
- Full access to all company data
- View all expenses from all users
- Manage users and approval workflows
- Access to comprehensive analytics

### Manager
- View expenses from assigned employees
- Approve/reject expense requests
- View team analytics

### Employee
- Submit expense claims
- View own expense history
- Track approval status

## 🗄️ Database Schema

The application uses the following main tables:

- **companies**: Company information
- **users**: User accounts with roles
- **expenses**: Expense records
- **expense_receipts**: Receipt attachments
- **approval_flows**: Approval workflow configurations
- **approval_steps**: Individual approval steps
- **expense_approvals**: Approval tracking
- **manager_relationships**: Manager-employee relationships
- **audit_logs**: System audit trail

## 🧪 Testing the API

### Health Check

```bash
curl http://localhost:5000/health
```

### Create Admin Account (Signup)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123",
    "name": "Admin User",
    "companyName": "My Company",
    "country": "United States"
  }'
```

### Get Dashboard Data

```bash
curl http://localhost:5000/api/dashboard/admin \
  -H "Authorization: Bearer <your_token>"
```

## 🔧 Troubleshooting

### Database Connection Issues

1. **Error: Access denied for user**
   - Check your MySQL username and password in `.env`
   - Ensure MySQL server is running

2. **Error: Unknown database**
   - Make sure you created the database: `CREATE DATABASE expense_management;`

3. **Error: Table doesn't exist**
   - Run all the CREATE TABLE statements from the schema

### Port Already in Use

If port 5000 is already in use, change the `PORT` in `.env`:

```env
PORT=3001
```

### JWT Token Issues

1. **Error: Invalid token**
   - Token might be expired (default: 7 days)
   - Login again to get a new token

2. **Error: Access token required**
   - Include the Authorization header with Bearer token

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| DB_HOST | MySQL host | localhost | Yes |
| DB_USER | MySQL username | root | Yes |
| DB_PASSWORD | MySQL password | - | Yes |
| DB_NAME | Database name | expense_management | Yes |
| DB_PORT | MySQL port | 3306 | No |
| PORT | Server port | 5000 | No |
| NODE_ENV | Environment | development | No |
| CLIENT_URL | Frontend URL | http://localhost:5173 | No |
| JWT_SECRET | JWT signing key | - | Yes |
| JWT_EXPIRES_IN | Token expiry | 7d | No |
| EMAIL_USER | Gmail address for sending emails | - | Yes* |
| EMAIL_PASSWORD | Gmail App Password | - | Yes* |
| EMAIL_FROM_NAME | Sender name in emails | Expense Manager | No |

*Required for email functionality. See [Email Setup Guide](../EMAIL_SETUP_GUIDE.md)

## 🚀 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for sensitive data
- [ ] Configure email service (Gmail App Password or dedicated email service)
- [ ] Enable HTTPS
- [ ] Set up proper CORS configuration
- [ ] Configure database connection pooling
- [ ] Set up logging and monitoring
- [ ] Regular database backups
- [ ] Consider using dedicated email service (SendGrid, AWS SES) for production

## 📄 License

This project is part of the Expense Management System.

## 🤝 Support

For issues or questions, please contact the development team.
