# ⚡ Quick Start Guide

## 🎯 Prerequisites
- Node.js v16+
- MySQL 8.0+
- npm

---

## 🚀 Setup (First Time Only)

### 1️⃣ Database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE expense_management;
USE expense_management;
-- Run all CREATE TABLE statements from your schema
EXIT;
```

### 2️⃣ Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_management
PORT=5000
JWT_SECRET=change_this_secret_key
JWT_EXPIRES_IN=7d
```

### 3️⃣ Frontend
```bash
cd ..
npm install
```

Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Run Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
✅ Should see: "Database connected successfully" on port 5000

### Terminal 2 - Frontend
```bash
cd expense-manager
npm run dev
```
✅ Should see: "Local: http://localhost:5173"

---

## 🌐 Access

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 👤 First Login

1. Go to http://localhost:5173/login
2. Click "Create new company account"
3. Fill in:
   - Name: Your Name
   - Company: Your Company
   - Email: admin@company.com
   - Password: password123
   - Country: United States
4. Click "Create Company Account"
5. ✅ You're in!

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check MySQL is running
mysql -u root -p

# Verify .env file exists
cd server
cat .env  # or type .env on Windows
```

### Frontend can't connect
```bash
# Check backend is running
curl http://localhost:5000/health

# Verify .env in root directory
cat .env  # or type .env on Windows
```

### Database errors
```sql
-- Check database exists
SHOW DATABASES;

-- Check tables exist
USE expense_management;
SHOW TABLES;  -- Should show 9 tables
```

---

## 📦 Project Structure

```
expense-manager/
├── server/              ← Backend (Node.js + Express)
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── .env            ← Create this!
│   └── server.js
├── src/                 ← Frontend (React + TypeScript)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── context/
├── .env                 ← Create this!
└── package.json
```

---

## 🎯 Key Commands

```bash
# Backend
cd server
npm install          # Install dependencies
npm run dev          # Start dev server
npm start            # Start production server

# Frontend
cd expense-manager
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production

# Database
mysql -u root -p     # Login to MySQL
```

---

## 📚 Documentation

- **Full Setup:** `SETUP_GUIDE.md`
- **Backend API:** `server/README.md`
- **Integration Details:** `INTEGRATION_SUMMARY.md`

---

## ✅ Success Checklist

- [ ] MySQL running
- [ ] Database created
- [ ] 9 tables created
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard loads

---

**Need help? Check `SETUP_GUIDE.md` for detailed instructions!**
