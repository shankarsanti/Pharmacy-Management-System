# Pharmacy Management System - Complete Setup Guide

This guide will help you set up the complete pharmacy management system with Node.js + Express + MySQL backend and React frontend.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create MySQL Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE pharmacy_db;
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pharmacy_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

### 5. Initialize Database Schema

Run the SQL schema file to create all tables:

```bash
# Using MySQL command line
mysql -u root -p pharmacy_db < config/schema.sql

# Or copy the contents of config/schema.sql and run in MySQL Workbench
```

### 6. Seed Database with Initial Data

```bash
node scripts/seedDatabase.js
```

This will create:
- 2 users (Admin and Pharmacist)
- 8 medicine categories
- 5 suppliers
- 5 sample medicines

### 7. Start Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend will run on `http://localhost:5000`

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
🏥 Pharmacy Management System Backend
```

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a new terminal and run:

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Axios (for API calls)

```bash
npm install axios
```

### 4. Configure Environment Variables

The `.env` file is already created with:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Login Credentials

After seeding the database, use these credentials:

### Admin Account
- Email: `admin@pharmacare.com`
- Password: `admin123`
- Role: Admin (Full access)

### Pharmacist Account
- Email: `rahul@pharmacare.com`
- Password: `pharma123`
- Role: Pharmacist (Limited access)

## Verify Setup

1. Open browser and go to `http://localhost:5173`
2. Login with admin credentials
3. You should see the dashboard with:
   - Sample medicines
   - Categories
   - Suppliers
   - Dashboard statistics

## API Testing

You can test the API using:

### Health Check
```bash
curl http://localhost:5000/health
```

### Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pharmacare.com","password":"admin123"}'
```

## Features Available

### Backend Features
- ✅ JWT Authentication & Authorization
- ✅ User Management (Admin, Pharmacist, Manager roles)
- ✅ Medicine Inventory Management
- ✅ Stock Entry & Tracking
- ✅ Sales & Billing System
- ✅ Dashboard Statistics
- ✅ Notifications (Low Stock, Expiry Alerts)
- ✅ Audit Logs
- ✅ Supplier Management
- ✅ Category Management

### Frontend Features
- ✅ User Authentication
- ✅ Dashboard with Statistics
- ✅ Medicine Inventory Management
- ✅ POS (Point of Sale) System
- ✅ Stock Entry Management
- ✅ Sales History
- ✅ Supplier Management
- ✅ Category Management
- ✅ User Management (Admin)
- ✅ Notifications
- ✅ Reports
- ✅ Settings

## Database Schema

The system includes these tables:
- `users` - User accounts and authentication
- `categories` - Medicine categories
- `suppliers` - Supplier information
- `medicines` - Medicine inventory
- `stock_entries` - Stock purchase records
- `stock_entry_items` - Individual items in stock entries
- `sales` - Sales transactions
- `sale_items` - Individual items in sales
- `audit_logs` - System activity logs
- `notifications` - System notifications
- `settings` - Application settings

## Troubleshooting

### Backend Issues

**Database Connection Failed**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env` file
- Ensure database `pharmacy_db` exists

**Port Already in Use**
- Change PORT in `.env` to another port (e.g., 5001)
- Kill process using port 5000: `lsof -ti:5000 | xargs kill`

**JWT Token Errors**
- Ensure JWT_SECRET is set in `.env`
- Clear browser localStorage and login again

### Frontend Issues

**API Connection Failed**
- Ensure backend is running on port 5000
- Check VITE_API_URL in `.env`
- Check browser console for CORS errors

**Axios Not Found**
- Run: `npm install axios`

**Build Errors**
- Delete `node_modules` and `package-lock.json`
- Run: `npm install`

## Development Workflow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Make changes to code
4. Both servers will auto-reload on changes

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Use PM2 or similar process manager
5. Set up SSL/TLS
6. Configure firewall

### Frontend
1. Build: `npm run build`
2. Deploy `dist` folder to hosting service
3. Update `VITE_API_URL` to production API URL

## Next Steps

1. Update the frontend components to use the API service
2. Remove mock data dependencies
3. Test all features with real backend
4. Add error handling and loading states
5. Implement real-time notifications
6. Add data validation
7. Implement file uploads for medicine images
8. Add reporting features

## Support

For issues:
1. Check backend logs in terminal
2. Check browser console for frontend errors
3. Verify database connection
4. Check API endpoints with curl or Postman

## API Documentation

Full API documentation is available in `backend/README.md`

Key endpoints:
- `POST /api/auth/login` - Login
- `GET /api/medicines` - Get all medicines
- `POST /api/sales` - Create sale
- `GET /api/dashboard/stats` - Dashboard statistics

See `backend/README.md` for complete API reference.
