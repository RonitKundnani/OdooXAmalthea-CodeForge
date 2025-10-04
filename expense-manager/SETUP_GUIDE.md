# 🚀 Expense Manager - Complete Setup Guide

This guide will walk you through setting up the complete Expense Management System with MySQL integration.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Testing the Integration](#testing-the-integration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- ✅ **Git** (optional) - [Download](https://git-scm.com/)
- ✅ **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Verify Installations

```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 8.x.x or higher
mysql --version   # Should show 8.0.x or higher
```

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "MySQL" service and start it
- Or use MySQL Workbench

**Mac/Linux:**
```bash
sudo service mysql start
# or
sudo systemctl start mysql
```

### Step 2: Create Database and Tables

1. **Login to MySQL:**

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

2. **Create the Database:**

```sql
CREATE DATABASE expense_management;
USE expense_management;
```

3. **Create Tables** (copy and paste all these commands):

```sql
-- Companies table
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    currency_code VARCHAR(5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','manager','employee') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Manager relationships
CREATE TABLE manager_relationships (
    relationship_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES users(user_id),
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
);

-- Expenses table
CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    amount_original DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(5) NOT NULL,
    amount_converted DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    expense_date DATE,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Expense receipts
CREATE TABLE expense_receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    file_url VARCHAR(255),
    ocr_data JSON,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id)
);

-- Approval flows
CREATE TABLE approval_flows (
    flow_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(100),
    approval_type ENUM('sequential','percentage','specific','hybrid') NOT NULL,
    percentage_required INT NULL,
    specific_user_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (specific_user_id) REFERENCES users(user_id)
);

-- Approval steps
CREATE TABLE approval_steps (
    step_id INT AUTO_INCREMENT PRIMARY KEY,
    flow_id INT NOT NULL,
    approver_id INT NOT NULL,
    step_order INT NOT NULL,
    FOREIGN KEY (flow_id) REFERENCES approval_flows(flow_id),
    FOREIGN KEY (approver_id) REFERENCES users(user_id)
);

-- Expense approvals
CREATE TABLE expense_approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    approver_id INT NOT NULL,
    step_id INT NOT NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    comments TEXT,
    action_date DATETIME NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id),
    FOREIGN KEY (approver_id) REFERENCES users(user_id),
    FOREIGN KEY (step_id) REFERENCES approval_steps(step_id)
);

-- Audit logs
CREATE TABLE audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    entity_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

4. **Verify Tables Created:**

```sql
SHOW TABLES;
```

You should see 9 tables listed.

5. **Exit MySQL:**

```sql
EXIT;
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Server Directory

```bash
cd expense-manager/server
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- mysql2
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- express-validator

### Step 3: Configure Environment Variables

1. **Copy the example file:**

```bash
# Windows PowerShell
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

2. **Edit the `.env` file** with your MySQL credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=expense_management
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (Change this!)
JWT_SECRET=my_super_secret_jwt_key_12345_change_in_production
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANT:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password!

### Step 4: Test Backend Connection

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
📊 Environment: development
🔗 API URL: http://localhost:5000
💚 Health check: http://localhost:5000/health
```

**If you see errors, check the [Troubleshooting](#troubleshooting) section.**

Keep this terminal window open (backend server running).

---

## 💻 Frontend Setup

### Step 1: Open New Terminal

Open a **new terminal window** (keep the backend running in the first one).

### Step 2: Navigate to Project Root

```bash
cd expense-manager
```

### Step 3: Install Frontend Dependencies

```bash
npm install
```

### Step 4: Configure Frontend Environment

1. **Create `.env` file in the root directory:**

```bash
# Windows PowerShell
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

2. **Edit `.env` file:**

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🎯 Running the Application

### You should now have TWO terminals running:

1. **Terminal 1 (Backend):**
   ```
   Location: expense-manager/server
   Command: npm run dev
   Port: 5000
   ```

2. **Terminal 2 (Frontend):**
   ```
   Location: expense-manager
   Command: npm run dev
   Port: 5173
   ```

### Access the Application

Open your browser and go to:
```
http://localhost:5173
```

---

## 🧪 Testing the Integration

### Test 1: Create Admin Account

1. Go to `http://localhost:5173/login`
2. Click **"Create new company account"**
3. Fill in the form:
   - **Full Name:** John Doe
   - **Company Name:** Acme Corporation
   - **Email:** admin@acme.com
   - **Password:** password123
   - **Country:** United States
4. Click **"Create Company Account"**
5. You should be redirected to the dashboard

### Test 2: Verify Database Entry

Open MySQL and check:

```sql
USE expense_management;

-- Check if company was created
SELECT * FROM companies;

-- Check if admin user was created
SELECT user_id, name, email, role, company_id FROM users;

-- Check audit log
SELECT * FROM audit_logs;
```

### Test 3: Login

1. Logout (if logged in)
2. Go to login page
3. Enter credentials:
   - **Email:** admin@acme.com
   - **Password:** password123
4. Click **"Login to Your Account"**
5. You should see the admin dashboard with your data

### Test 4: Dashboard Data

The admin dashboard should display:
- Total Expenses: 0
- Pending: 0
- Approved: 0
- Rejected: 0
- Total Amount: USD 0.00
- Total Users: 1

---

## 🐛 Troubleshooting

### Backend Issues

#### ❌ Error: "Database connection failed"

**Solution:**
1. Check if MySQL is running:
   ```bash
   # Windows
   services.msc (look for MySQL)
   
   # Mac/Linux
   sudo service mysql status
   ```

2. Verify credentials in `server/.env`:
   - DB_USER (usually 'root')
   - DB_PASSWORD (your MySQL password)
   - DB_NAME (expense_management)

3. Test MySQL connection manually:
   ```bash
   mysql -u root -p
   ```

#### ❌ Error: "Unknown database 'expense_management'"

**Solution:**
```sql
mysql -u root -p
CREATE DATABASE expense_management;
```

#### ❌ Error: "Table 'expenses' doesn't exist"

**Solution:**
Run all the CREATE TABLE statements from [Database Setup](#database-setup).

#### ❌ Error: "Port 5000 is already in use"

**Solution:**
Change the port in `server/.env`:
```env
PORT=5001
```

Then update frontend `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Frontend Issues

#### ❌ Error: "Network Error" or "Failed to fetch"

**Solution:**
1. Make sure backend is running (`npm run dev` in server folder)
2. Check backend URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart frontend after changing `.env`

#### ❌ Login/Signup not working

**Solution:**
1. Open browser console (F12)
2. Check for error messages
3. Verify backend is responding:
   ```bash
   curl http://localhost:5000/health
   ```

#### ❌ Dashboard shows "Failed to load dashboard data"

**Solution:**
1. Check if you're logged in (token exists)
2. Clear localStorage and login again:
   ```javascript
   // In browser console
   localStorage.clear()
   ```
3. Check backend logs for errors

### Database Issues

#### ❌ Foreign key constraint errors

**Solution:**
Drop all tables and recreate them in the correct order:

```sql
USE expense_management;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS expense_approvals;
DROP TABLE IF EXISTS approval_steps;
DROP TABLE IF EXISTS approval_flows;
DROP TABLE IF EXISTS expense_receipts;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS manager_relationships;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS companies;
SET FOREIGN_KEY_CHECKS = 1;
```

Then recreate all tables from [Database Setup](#database-setup).

---

## 🎉 Success Checklist

- [ ] MySQL server is running
- [ ] Database `expense_management` exists
- [ ] All 9 tables are created
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Can access login page at http://localhost:5173/login
- [ ] Can create admin account
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] Database contains company and user records

---

## 📚 Next Steps

Once everything is working:

1. **Create Test Data:**
   - Add more users (managers, employees)
   - Submit test expenses
   - Test approval workflows

2. **Explore Features:**
   - Submit expenses
   - View expense history
   - Manage users (admin)
   - Approval workflows

3. **Customize:**
   - Add more expense categories
   - Configure approval flows
   - Customize dashboard

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check all logs:**
   - Backend terminal output
   - Frontend terminal output
   - Browser console (F12)
   - MySQL error logs

2. **Verify versions:**
   ```bash
   node --version   # Should be v16+
   npm --version    # Should be 8+
   mysql --version  # Should be 8.0+
   ```

3. **Clean install:**
   ```bash
   # Backend
   cd server
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd ..
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📝 Quick Start Commands

```bash
# Terminal 1 - Backend
cd expense-manager/server
npm install
# Create and configure .env file
npm run dev

# Terminal 2 - Frontend
cd expense-manager
npm install
# Create and configure .env file
npm run dev

# Browser
# Open http://localhost:5173
```

---

**Happy coding! 🚀**
