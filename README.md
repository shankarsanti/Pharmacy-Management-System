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
- 📝 **Audit Logs** - Complete activity tracking with database persistence
- 🩺 **Doctor Management** - Manage doctors for prescriptions
- 📋 **Customer Requests** - Track medicines requested by customers not in stock
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

# 4. Open http://localhost:5173 (or the port shown in terminal)
```

### Default Login
- **Admin:** admin@pharmacare.com / admin123
- **Pharmacist:** rahul@pharmacare.com / pharma123

### Important Notes
- Backend runs on port **5001**
- Frontend runs on port **5173** or **5174** (Vite auto-assigns)
- CORS is configured for both ports automatically
- If you get CORS errors, restart the backend server

## 📚 Documentation

- **[README.md](README.md)** - Main project overview (you are here)
- **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Detailed project structure
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide (Render, Vercel, Railway, VPS)
- **[docs/CLEANUP_SUMMARY.md](docs/CLEANUP_SUMMARY.md)** - Project organization and maintenance
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[frontend/README.md](frontend/README.md)** - Frontend documentation

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
│   │   ├── database.js        # MySQL connection pool
│   │   └── schema.sql         # Complete database schema
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js   # Global error handler
│   ├── routes/                # API endpoints (13 routes)
│   │   ├── auth.js           # Authentication
│   │   ├── users.js          # User management
│   │   ├── medicines.js      # Medicine inventory
│   │   ├── categories.js     # Categories
│   │   ├── suppliers.js      # Suppliers
│   │   ├── sales.js          # Sales transactions
│   │   ├── stockEntries.js   # Stock purchases
│   │   ├── notifications.js  # Notifications
│   │   ├── auditLogs.js      # Activity logs
│   │   ├── dashboard.js      # Dashboard stats
│   │   ├── settings.js       # System settings
│   │   ├── doctors.js        # Doctor management
│   │   └── customerRequests.js # Customer requests
│   ├── scripts/
│   │   ├── seedDatabase.js   # Database seeding
│   │   ├── addCustomerRequestsTable.js
│   │   └── addDoctorsTable.js
│   ├── .env.example          # Environment template
│   ├── server.js             # Express server
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components (organized by feature)
│   │   │   ├── auth/         # Login, Protected Routes
│   │   │   ├── common/       # Reusable components
│   │   │   ├── dashboard/    # Dashboard
│   │   │   ├── inventory/    # Inventory + Customer Requests
│   │   │   ├── categories/   # Category management
│   │   │   ├── suppliers/    # Supplier management
│   │   │   ├── stocks/       # Stock management
│   │   │   ├── sales/        # Sales history
│   │   │   ├── pos/          # Point of Sale
│   │   │   ├── expiry/       # Expiry management
│   │   │   ├── settings/     # Settings + Doctors
│   │   │   ├── audit/        # Audit logs
│   │   │   └── ...
│   │   ├── context/          # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SettingsContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios API client
│   │   ├── utils/
│   │   │   └── auditLogger.js # Audit logging utility
│   │   └── data/
│   │       └── mockData.js   # Helper functions
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/                       # Documentation
│   ├── PROJECT_STRUCTURE.md   # Detailed structure
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── CLEANUP_SUMMARY.md     # Maintenance guide
│
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
├── render.yaml                # Render deployment
└── vercel.json                # Vercel deployment
```

For detailed structure documentation, see [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

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
- **doctors** - Doctor information for prescriptions
- **customer_requests** - Customer medicine requests

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
- Fast medicine search with real-time stock levels
- Strip/loose tablet sales with stock validation
- Multiple payment methods (Cash, UPI with QR code)
- Automatic stock deduction after each sale
- Professional invoice generation with print support
- Customer tracking (name, phone, village, doctor)
- Real-time synchronization with sales and inventory
- Doctor management (add new doctors on-the-fly)
- Configurable settings (tax rates, rounding, GST)

### Customer Requests
- Track medicines customers ask for that aren't in stock
- Store customer contact information
- Status tracking (Pending, Ordered, Fulfilled, Cancelled)
- Notes and additional details
- Helps plan future inventory purchases

### Doctor Management
- Add and manage doctors for prescriptions
- Store specialization and contact information
- Available in POS "Prescribed By" dropdown
- Database persistence across sessions

### Audit Logging
- Automatic logging of all system activities
- Track user login/logout events
- Monitor inventory changes
- Sales and stock entry tracking
- User and settings modifications
- Complete audit trail for compliance

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

### ✅ Completed (93% Overall)
- ✅ Complete backend API with MySQL (100%)
- ✅ Database schema and relationships
- ✅ JWT authentication system
- ✅ All API endpoints (45+)
- ✅ Database seeding script
- ✅ Frontend API service layer
- ✅ Updated authentication context
- ✅ Comprehensive documentation
- ✅ Customer Requests feature
- ✅ Doctor Management with database persistence
- ✅ Audit Logging system

### ✅ Frontend Components Connected to Database (13/14 - 93%)
1. ✅ **Login** - JWT authentication with audit logging
2. ✅ **Dashboard** - Real-time statistics
3. ✅ **Inventory** - Full CRUD operations with Customer Requests tab
4. ✅ **Categories** - Full CRUD operations
5. ✅ **Suppliers** - Full CRUD operations
6. ✅ **Stock Entry** - Purchase order management
7. ✅ **Remaining Stocks** - Real-time stock levels
8. ✅ **Expiry Management** - Expiry tracking
9. ✅ **Sales** - Sales history and reports
10. ✅ **POS (Point of Sale)** - Complete billing system with stock updates
11. ✅ **Settings** - Doctor management with database persistence
12. ✅ **Audit Logs** - Activity tracking with database storage
13. ✅ **Customer Requests** - Track requested medicines

### 🔄 Remaining Components (1/14)
- User Management
- Notifications
- Reports

### 📋 Future Enhancements
- Real-time notifications with WebSocket
- File upload for medicine images
- Advanced analytics and reporting
- Barcode scanning support
- Multi-location inventory
- Automated reorder points
- Email notifications for low stock
- SMS integration for customer alerts
- Prescription management system
- Insurance claim processing

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

Common issues and solutions:

### CORS Errors
**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**
1. Check your frontend port (shown in terminal when you run `npm run dev`)
2. Update `backend/.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173,http://localhost:5174
   ```
3. Restart backend server: `Ctrl+C` then `npm run dev`

### Database Connection Failed
**Problem:** "Database connection failed"

**Solution:**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `backend/.env`
- Ensure database exists: `CREATE DATABASE pharmacy_db;`

### Port Already in Use
**Problem:** "Port 5001 is already in use"

**Solution:**
- Change PORT in `backend/.env`
- Or kill process: `lsof -ti:5001 | xargs kill -9`

### 401 Unauthorized Errors
**Problem:** Getting 401 errors on API calls

**Solution:**
- Clear browser localStorage
- Login again
- Check JWT_SECRET in `backend/.env`

For more detailed troubleshooting, check the [docs/](docs/) folder.

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

1. ✅ Backend API complete and tested
2. ✅ Core features connected (Login, Dashboard, Inventory, POS, Sales, Stock Management)
3. ✅ Customer Requests feature implemented
4. ✅ Doctor Management with database persistence
5. ✅ Audit Logging system functional
6. 🔄 Complete remaining 1 component (User Management, Notifications, Reports)
7. 📝 Add advanced reporting features
8. 🚀 Deploy to production

## 🎉 What's Working Now

### Fully Functional Features:
- ✅ **Authentication** - Secure JWT-based login with audit logging
- ✅ **Dashboard** - Real-time statistics and insights
- ✅ **Inventory Management** - Complete medicine CRUD operations
- ✅ **Customer Requests** - Track medicines not in stock with customer info
- ✅ **Category Management** - Organize medicines by type
- ✅ **Supplier Management** - Vendor tracking and management
- ✅ **Stock Entry** - Record new stock purchases with batch tracking
- ✅ **Remaining Stocks** - Real-time stock level monitoring
- ✅ **Expiry Management** - Track and alert on expiring medicines
- ✅ **Sales History** - Complete sales tracking with filtering
- ✅ **POS (Point of Sale)** - Full billing system with automatic stock updates
- ✅ **Doctor Management** - Add/edit/delete doctors with database persistence
- ✅ **Audit Logs** - Complete activity tracking with database storage
- ✅ **Settings** - Comprehensive system configuration

### Test the System:
1. Login at http://localhost:5173
2. Navigate to POS and complete a sale
3. Check Sales section - your sale appears immediately!
4. Check Remaining Stocks - stock levels updated automatically!
5. Go to Settings → Manage Doctors - add/edit doctors
6. Go to Inventory → Customer Requests - track requested medicines
7. Check Audit Logs - see all system activities logged

## 📸 Screenshots

(Add screenshots of your application here)

## 🙏 Acknowledgments

Built with modern web technologies and best practices for pharmacy management.

---

**Status:** Backend Complete ✅ | Frontend 93% Complete (13/14 components) 🔄

**Version:** 1.2.0

**Last Updated:** March 3, 2026

**Progress:** 93% Complete - Production-ready with clean architecture!

**Repository:** [GitHub](https://github.com/shankarsanti/Pharmacy-Management-System)
