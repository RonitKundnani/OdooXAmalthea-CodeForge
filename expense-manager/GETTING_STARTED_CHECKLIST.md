# ✅ Getting Started Checklist

Use this checklist to set up your Expense Management System step by step.

---

## 📋 Pre-Setup

- [ ] Node.js v16+ installed (`node --version`)
- [ ] MySQL 8.0+ installed (`mysql --version`)
- [ ] npm installed (`npm --version`)
- [ ] Code editor ready (VS Code recommended)
- [ ] Two terminal windows available

---

## 🗄️ Database Setup

- [ ] MySQL server is running
- [ ] Logged into MySQL: `mysql -u root -p`
- [ ] Created database: `CREATE DATABASE expense_management;`
- [ ] Selected database: `USE expense_management;`
- [ ] Created `companies` table
- [ ] Created `users` table
- [ ] Created `manager_relationships` table
- [ ] Created `expenses` table
- [ ] Created `expense_receipts` table
- [ ] Created `approval_flows` table
- [ ] Created `approval_steps` table
- [ ] Created `expense_approvals` table
- [ ] Created `audit_logs` table
- [ ] Verified tables: `SHOW TABLES;` (should show 9 tables)
- [ ] Exited MySQL: `EXIT;`

---

## 🔧 Backend Setup

- [ ] Navigated to server directory: `cd server`
- [ ] Installed dependencies: `npm install`
- [ ] Created `.env` file: `copy .env.example .env` (Windows) or `cp .env.example .env` (Mac/Linux)
- [ ] Edited `.env` file with:
  - [ ] DB_HOST=localhost
  - [ ] DB_USER=root
  - [ ] DB_PASSWORD=**your_mysql_password**
  - [ ] DB_NAME=expense_management
  - [ ] DB_PORT=3306
  - [ ] PORT=5000
  - [ ] JWT_SECRET=**strong_random_string**
  - [ ] JWT_EXPIRES_IN=7d
- [ ] Started backend: `npm run dev`
- [ ] Saw success message: "✅ Database connected successfully"
- [ ] Backend running on port 5000
- [ ] Health check works: Open http://localhost:5000/health in browser

**Keep this terminal window open!**

---

## 💻 Frontend Setup

- [ ] Opened **new terminal window**
- [ ] Navigated to project root: `cd expense-manager`
- [ ] Installed dependencies: `npm install`
- [ ] Created `.env` file in root: `copy .env.example .env` (Windows) or `cp .env.example .env` (Mac/Linux)
- [ ] Edited `.env` file with:
  - [ ] VITE_API_URL=http://localhost:5000/api
- [ ] Started frontend: `npm run dev`
- [ ] Saw success message with local URL
- [ ] Frontend running on port 5173
- [ ] Opened http://localhost:5173 in browser

**Keep this terminal window open too!**

---

## 🎯 First Run

- [ ] Browser opened to http://localhost:5173/login
- [ ] Login page loads correctly
- [ ] Clicked "Create new company account"
- [ ] Filled in signup form:
  - [ ] Full Name: **Your Name**
  - [ ] Company Name: **Your Company**
  - [ ] Email: **admin@company.com**
  - [ ] Password: **password123**
  - [ ] Country: **United States** (or your country)
- [ ] Clicked "Create Company Account"
- [ ] No errors appeared
- [ ] Redirected to dashboard
- [ ] Dashboard shows:
  - [ ] Welcome message with your name
  - [ ] "Admin Dashboard" subtitle
  - [ ] Statistics cards (all showing 0)
  - [ ] "No expenses found" message

---

## ✅ Verification

### Backend Verification
- [ ] Terminal 1 shows no errors
- [ ] Can access http://localhost:5000/health
- [ ] Response shows: `{"status":"OK","message":"Expense Manager API is running"}`

### Frontend Verification
- [ ] Terminal 2 shows no errors
- [ ] Login page accessible
- [ ] Dashboard accessible
- [ ] No console errors in browser (F12 → Console)

### Database Verification
Open MySQL and run:
```sql
USE expense_management;
SELECT * FROM companies;  -- Should show 1 company
SELECT * FROM users;      -- Should show 1 admin user
SELECT * FROM audit_logs; -- Should show 2 entries
```

- [ ] Company record exists
- [ ] Admin user exists
- [ ] Audit logs show COMPANY_CREATED and USER_LOGIN

---

## 🧪 Testing

### Test Login
- [ ] Logged out (if logged in)
- [ ] Went to login page
- [ ] Entered credentials:
  - Email: admin@company.com
  - Password: password123
- [ ] Clicked "Login to Your Account"
- [ ] Successfully logged in
- [ ] Dashboard loads with data

### Test Navigation
- [ ] Clicked "Dashboard" in sidebar
- [ ] Clicked "Submit Expense" in sidebar
- [ ] Clicked "History" in sidebar
- [ ] Clicked "Settings" in sidebar
- [ ] All pages load without errors

### Test Protected Routes
- [ ] Tried accessing admin-only routes
- [ ] Routes are protected correctly
- [ ] No unauthorized access possible

---

## 🎉 Success Indicators

You're all set if you see:

✅ **Backend Terminal:**
```
✅ Database connected successfully
🚀 Server is running on port 5000
📊 Environment: development
```

✅ **Frontend Terminal:**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ **Browser:**
- Login page loads
- Can create account
- Can login
- Dashboard shows data
- Navigation works

✅ **Database:**
- 9 tables exist
- Company record exists
- Admin user exists
- Audit logs populated

---

## 🐛 If Something's Wrong

### Backend won't start
1. Check MySQL is running
2. Verify `.env` credentials
3. Check port 5000 is not in use
4. Review terminal errors

### Frontend won't start
1. Check `npm install` completed
2. Verify `.env` file exists
3. Check port 5173 is not in use
4. Clear node_modules and reinstall

### Can't login
1. Check backend is running
2. Open browser console (F12)
3. Check network tab for errors
4. Verify database has user record

### Database errors
1. Verify all 9 tables created
2. Check foreign key constraints
3. Verify MySQL version 8.0+
4. Check table structure matches schema

---

## 📚 Next Steps

Once everything is working:

- [ ] Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed info
- [ ] Review [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) for technical details
- [ ] Check [server/README.md](server/README.md) for API documentation
- [ ] Explore the application features
- [ ] Create test expenses
- [ ] Add more users (managers, employees)
- [ ] Test approval workflows

---

## 🆘 Need Help?

If you're stuck:

1. **Check Documentation:**
   - SETUP_GUIDE.md - Detailed setup
   - QUICK_START.md - Quick commands
   - INTEGRATION_SUMMARY.md - Technical details

2. **Common Solutions:**
   - Restart both servers
   - Clear browser cache
   - Drop and recreate database
   - Delete node_modules and reinstall

3. **Debug Steps:**
   - Check all terminal outputs
   - Open browser console (F12)
   - Verify environment variables
   - Test database connection manually

---

## 🎊 Congratulations!

If you've checked all the boxes above, your Expense Management System is ready to use!

**Happy expense tracking! 💼**
