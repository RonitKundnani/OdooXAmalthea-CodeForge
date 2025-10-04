# 💼 Expense Management System

A comprehensive expense management application with role-based access control, built with React, Node.js, Express, and MySQL.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin, Manager, Employee)
- Protected routes on frontend and backend

### 👥 User Roles

**Admin**
- Full company oversight
- View all expenses and users
- Manage approval workflows
- Access comprehensive analytics
- User management

**Manager**
- View team expenses
- Approve/reject expense requests
- Team analytics and reports
- Manage assigned employees

**Employee**
- Submit expense claims
- Upload receipts
- Track approval status
- View personal expense history

### 💰 Expense Management
- Create, read, update, delete expenses
- Multi-currency support
- Category-based organization
- Receipt attachment support
- Real-time status tracking

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Expense statistics and trends
- Recent activity tracking
- Visual data representation

### 🔄 Approval Workflows
- Configurable approval flows
- Sequential approval process
- Manager-employee relationships
- Approval history tracking

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd expense-manager
```

2. **Setup Database**
```bash
mysql -u root -p
CREATE DATABASE expense_management;
# Run the schema from your SQL file
```

3. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

4. **Setup Frontend**
```bash
cd ..
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

5. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## 📁 Project Structure

```
expense-manager/
├── server/                  # Backend (Node.js + Express)
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication middleware
│   ├── routes/             # API routes
│   ├── .env.example        # Environment template
│   ├── server.js           # Main server file
│   └── README.md           # Backend documentation
│
├── src/                     # Frontend (React + TypeScript)
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   └── users/         # User management
│   ├── pages/             # Page components
│   │   ├── auth/          # Login/Signup pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── expenses/      # Expense pages
│   │   └── settings/      # Settings page
│   ├── services/          # API service layer
│   ├── context/           # React Context (Auth)
│   └── types/             # TypeScript types
│
├── SETUP_GUIDE.md          # Detailed setup instructions
├── QUICK_START.md          # Quick reference guide
├── INTEGRATION_SUMMARY.md  # Technical integration details
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create company and admin account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/manager` - Manager dashboard data
- `GET /api/dashboard/employee` - Employee dashboard data

### Expenses
- `GET /api/expenses` - List expenses (role-filtered)
- `GET /api/expenses/:id` - Get expense details
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Material-UI** - Component library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin support
- **Dotenv** - Environment variables

### Database
- **MySQL 8.0** - Relational database
- 9 normalized tables
- Foreign key constraints
- Transaction support

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT token authentication (7-day expiry)
- ✅ Role-based access control
- ✅ SQL injection protection (parameterized queries)
- ✅ Input validation on both frontend and backend
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Audit logging for compliance

## 📊 Database Schema

### Core Tables
- **companies** - Company information
- **users** - User accounts with roles
- **expenses** - Expense records
- **manager_relationships** - Org hierarchy
- **approval_flows** - Workflow configurations
- **expense_approvals** - Approval tracking
- **audit_logs** - System audit trail

## 🧪 Testing

### Create Test Account
1. Visit http://localhost:5173/login
2. Click "Create new company account"
3. Fill in details and submit
4. You'll be logged in as admin

### Test Credentials (after signup)
```
Email: admin@company.com
Password: password123
Role: Admin
```

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup walkthrough
- **[QUICK_START.md](QUICK_START.md)** - Quick reference commands
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - Technical details
- **[server/README.md](server/README.md)** - Backend API documentation

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
- Check MySQL is running
- Verify credentials in `server/.env`

**Frontend can't reach backend**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`

**Token expired**
- Clear localStorage and login again
- Check JWT_EXPIRES_IN in server config

For more solutions, see [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

## 🚀 Deployment

### Production Checklist
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Configure production database
- [ ] Set up logging and monitoring
- [ ] Regular database backups
- [ ] Configure CORS for production domain

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed as part of the Odoo Expense Management System project.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend
- MySQL for reliable data storage
- All open-source contributors

## 📞 Support

For issues or questions:
- Check the [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Review [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)
- Open an issue on GitHub

---

**Built with ❤️ using React, Node.js, and MySQL**
