# Quick Start Guide

Get the pharmacy management system running in 5 minutes!

## Prerequisites
- Node.js installed
- MySQL installed and running

## Step 1: Database Setup (2 minutes)

```bash
# Create database
mysql -u root -p
CREATE DATABASE pharmacy_db;
exit;

# Import schema
cd backend
mysql -u root -p pharmacy_db < config/schema.sql
```

## Step 2: Backend Setup (1 minute)

```bash
# Install dependencies
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MySQL password

# Seed database
node scripts/seedDatabase.js

# Start backend
npm run dev
```

Backend runs on: http://localhost:5000

## Step 3: Frontend Setup (1 minute)

```bash
# Open new terminal
cd frontend
npm install

# Start frontend
npm run dev
```

Frontend runs on: http://localhost:5173

## Step 4: Login

Open http://localhost:5173 and login:

**Admin:**
- Email: admin@pharmacare.com
- Password: admin123

**Pharmacist:**
- Email: rahul@pharmacare.com
- Password: pharma123

## Done! 🎉

You now have:
- ✅ Backend API running with MySQL
- ✅ Frontend React app running
- ✅ Sample data loaded
- ✅ Authentication working

## What's Next?

1. Explore the dashboard
2. Add new medicines
3. Create sales transactions
4. Manage inventory
5. View reports

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions.
