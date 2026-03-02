# 🏥 Pharmacy Management System

A complete, production-ready pharmacy management system with Node.js + Express + MySQL backend and React frontend.

## ✨ Features

### Core Functionality
- 🔐 **Authentication & Authorization** - JWT-based with role management
- 💊 **Medicine Inventory** - Complete stock management with batch tracking
- 📦 **Stock Management** - Purchase orders and stock entries
- 💰 **Point of Sale (POS)** - Fast billing with strip/loose tablet support
- 📊 **Dashboard** - Real-time statistics and insights
- 🔔 **Smart Notifications** - Low stock, expiry, and out-of-stock alerts
- 📈 **Reports & Analytics** - Sales reports and inventory analysis
- 👥 **User Management** - Multi-role support (Admin, Pharmacist, Manager)
- 🏢 **Supplier Management** - Vendor tracking and order history
- 📂 **Category Management** - Organize medicines by type
- 📝 **Audit Logs** - Complete activity tracking
- ⚙️ **Settings** - Customizable system configuration

### Technical Features
- ✅ RESTful API with 40+ endpoints
- ✅ MySQL database with proper relationships
- ✅ JWT authentication with automatic refresh
- ✅ Role-based access control
- ✅ Transaction support for data integrity
- ✅ Connection pooling for performance
- ✅ Comprehensive error handling
- ✅ Security best practices
- ✅ Responsive React UI
- ✅ Modern Tailwind CSS styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

### 5-Minute Setup

```bash
# 1. Clone and setup database
mysql -u root -p
CREATE DATABASE pharmacy_db;
exit;

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL password
mysql -u root -p pharmacy_db < config/schema.sql
node scripts/seedDatabase.js
npm run dev

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# 4. Open http://localhost:5173
```

### Default Login
- **Admin:** admin@pharmacare.com / admin123
- **Pharmacist:** rahul@pharmacare.com / pharma123

## 📚 Documentation

- **[Setup Guide](SETUP_GUIDE.md)** - Complete installation instructions
- **[Quick Start](QUICK_START.md)** - Get running in 5 minutes
- **[Migration Guide](MIGRATION_GUIDE.md)** - Update components to use API
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Backend API](backend/README.md)** - API documentation
- **[Frontend Checklist](FRONTEND_UPDATE_CHECKLIST.md)** - Component update tracking
- **[Project Summary](PROJECT_SUMMARY.md)** - Complete project overview

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Database:** MySQL 8.0+
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs, CORS
- **ORM:** mysql2 with connection pooling

### Frontend
- **Framework:** React 19.2.0
- **Routing:** React Router DOM v7.13.1
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS v4.2.1
- **Build Tool:** Vite v7.3.1

## 📁 Project Structure

```
pharmacy-management-system/
├── backend/                    # Node.js + Express backend
│   ├── config/
│   │   ├── database.js        # MySQL connection
│   │   └── schema.sql         # Database schema
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── medicines.js
│   │   ├── sales.js
│   │   ├── stockEntries.js
│   │   ├── suppliers.js
│   │   ├── categories.js
│   │   ├── notifications.js
│   │   ├── auditLogs.js
│   │   └── dashboard.js
│   ├── scripts/
│   │   └── seedDatabase.js    # Database seeding
│   ├── server.js              # Main server
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   └── data/
│   │       └── mockData.js    # Mock data (to be removed)
│   ├── package.json
│   └── .env
│
└── docs/                       # Documentation
    ├── SETUP_GUIDE.md
    ├── QUICK_START.md
    ├── MIGRATION_GUIDE.md
    ├── TROUBLESHOOTING.md
    └── PROJECT_SUMMARY.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/alerts/low-stock` - Low stock alerts
- `GET /api/medicines/alerts/expiring` - Expiring medicines

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale
- `GET /api/sales/stats/dashboard` - Sales statistics

### Stock Entries
- `GET /api/stock-entries` - Get all stock entries
- `POST /api/stock-entries` - Create stock entry

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

[See full API documentation](backend/README.md)

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **medicines** - Medicine inventory
- **categories** - Medicine categories
- **suppliers** - Supplier information
- **sales** - Sales transactions
- **sale_items** - Sale line items
- **stock_entries** - Stock purchases
- **stock_entry_items** - Stock entry line items
- **notifications** - System notifications
- **audit_logs** - Activity logs
- **settings** - System settings

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Automatic token expiration
- ✅ Secure password requirements

## 📊 Key Features Detail

### Medicine Management
- Track medicines with batch numbers
- Expiry date monitoring
- Low stock alerts
- Strip and loose tablet support
- Purchase and selling price tracking
- Category and supplier linking

### Point of Sale
- Fast medicine search
- Strip/loose tablet sales
- Multiple payment methods
- Automatic stock deduction
- Invoice generation
- Customer tracking

### Stock Management
- Purchase order tracking
- Batch-wise stock entry
- Automatic stock updates
- Supplier invoice tracking
- Multiple payment modes

### Dashboard
- Today's sales and revenue
- Monthly statistics
- Low stock alerts
- Expiring medicines
- Recent transactions
- Top selling medicines

## 🚧 Current Status

### ✅ Completed
- Complete backend API with MySQL
- Database schema and relationships
- JWT authentication system
- All API endpoints (40+)
- Database seeding script
- Frontend API service layer
- Updated authentication context
- Comprehensive documentation

### 🔄 In Progress
- Frontend component updates to use API
- Remove mock data dependencies

### 📋 Todo
- Update all frontend components (see [checklist](FRONTEND_UPDATE_CHECKLIST.md))
- Add loading states and error handling
- Implement toast notifications
- Add data caching
- Real-time notifications
- File upload for medicine images
- Advanced reporting features

## 🧪 Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pharmacare.com","password":"admin123"}'

# Get medicines (with token)
curl http://localhost:5000/api/medicines \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Frontend
1. Open http://localhost:5173
2. Login with admin credentials
3. Navigate through all features
4. Check browser console for errors
5. Verify API calls in Network tab

## 🐛 Troubleshooting

Common issues and solutions are documented in [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

Quick fixes:
- **Database connection failed:** Check MySQL is running and credentials in `.env`
- **Port in use:** Change PORT in `.env` or kill process on port 5000
- **CORS errors:** Verify CORS_ORIGIN matches frontend URL
- **401 errors:** Clear localStorage and login again

## 📦 Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Set up SSL/TLS
5. Use PM2 or similar process manager
6. Configure firewall and security groups

### Frontend
1. Build: `npm run build`
2. Deploy `dist` folder
3. Update `VITE_API_URL` to production API
4. Configure CDN
5. Enable compression

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For issues or questions:
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review [Setup Guide](SETUP_GUIDE.md)
3. Check backend logs
4. Inspect browser console
5. Test API with curl/Postman

## 🎯 Next Steps

1. Follow [Migration Guide](MIGRATION_GUIDE.md) to update frontend components
2. Use [Frontend Checklist](FRONTEND_UPDATE_CHECKLIST.md) to track progress
3. Test each component after updating
4. Remove mock data when all components are updated
5. Deploy to production

## 📸 Screenshots

(Add screenshots of your application here)

## 🙏 Acknowledgments

Built with modern web technologies and best practices for pharmacy management.

---

**Status:** Backend Complete ✅ | Frontend Migration In Progress 🔄

**Version:** 1.0.0

**Last Updated:** March 2, 2026
