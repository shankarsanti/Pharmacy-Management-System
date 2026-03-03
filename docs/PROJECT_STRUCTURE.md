# 📁 Project Structure

## Overview
This is a full-stack Pharmacy Management System with a clear separation between frontend and backend.

```
pharmacy-management-system/
├── backend/                    # Node.js + Express Backend
│   ├── config/                # Configuration files
│   │   ├── database.js       # MySQL connection pool
│   │   └── schema.sql        # Database schema
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js # Global error handler
│   ├── routes/              # API route handlers
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── users.js        # User management
│   │   ├── medicines.js    # Medicine inventory
│   │   ├── categories.js   # Category management
│   │   ├── suppliers.js    # Supplier management
│   │   ├── sales.js        # Sales transactions
│   │   ├── stockEntries.js # Stock purchases
│   │   ├── notifications.js # System notifications
│   │   ├── auditLogs.js    # Activity logs
│   │   ├── dashboard.js    # Dashboard statistics
│   │   ├── settings.js     # System settings
│   │   ├── doctors.js      # Doctor management
│   │   └── customerRequests.js # Customer requests
│   ├── scripts/            # Utility scripts
│   │   ├── seedDatabase.js # Database seeding
│   │   ├── addCustomerRequestsTable.js
│   │   └── addDoctorsTable.js
│   ├── .env.example        # Environment variables template
│   ├── .gitignore         # Git ignore rules
│   ├── package.json       # Dependencies
│   ├── README.md          # Backend documentation
│   ├── server.js          # Express server entry point
│   └── vercel.json        # Vercel deployment config
│
├── frontend/                  # React Frontend
│   ├── public/               # Static assets
│   │   └── vite.svg
│   ├── src/                  # Source code
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── common/     # Reusable components
│   │   │   ├── dashboard/  # Dashboard
│   │   │   ├── inventory/  # Inventory management
│   │   │   ├── categories/ # Category management
│   │   │   ├── suppliers/  # Supplier management
│   │   │   ├── stocks/     # Stock management
│   │   │   ├── sales/      # Sales history
│   │   │   ├── pos/        # Point of Sale
│   │   │   ├── expiry/     # Expiry management
│   │   │   ├── users/      # User management
│   │   │   ├── settings/   # Settings
│   │   │   ├── audit/      # Audit logs
│   │   │   ├── notifications/ # Notifications
│   │   │   ├── reports/    # Reports
│   │   │   ├── profile/    # User profile
│   │   │   └── errors/     # Error pages
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SettingsContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── data/           # Mock data (legacy)
│   │   │   └── mockData.js
│   │   ├── services/       # API services
│   │   │   └── api.js     # Axios API client
│   │   ├── utils/          # Utility functions
│   │   │   └── auditLogger.js
│   │   ├── App.css        # App styles
│   │   ├── App.jsx        # Main App component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # React entry point
│   ├── .env.example       # Environment variables template
│   ├── .gitignore        # Git ignore rules
│   ├── eslint.config.js  # ESLint configuration
│   ├── index.html        # HTML template
│   ├── package.json      # Dependencies
│   ├── README.md         # Frontend documentation
│   ├── vercel.json       # Vercel deployment config
│   └── vite.config.js    # Vite configuration
│
├── docs/                     # Documentation
│   └── PROJECT_STRUCTURE.md # This file
│
├── .gitignore               # Root git ignore
├── .vscode/                 # VS Code settings
├── README.md                # Main project documentation
├── render.yaml              # Render deployment config
└── vercel.json              # Root Vercel config

```

## Key Directories

### Backend (`/backend`)
- **Purpose:** RESTful API server
- **Technology:** Node.js, Express, MySQL
- **Port:** 5001 (configurable via .env)
- **Entry Point:** `server.js`

### Frontend (`/frontend`)
- **Purpose:** User interface
- **Technology:** React, Vite, Tailwind CSS
- **Port:** 5173 (Vite default)
- **Entry Point:** `src/main.jsx`

### Documentation (`/docs`)
- **Purpose:** Project documentation
- **Contents:** Architecture, guides, and references

## File Naming Conventions

### Backend
- Routes: `camelCase.js` (e.g., `auditLogs.js`)
- Middleware: `camelCase.js` (e.g., `errorHandler.js`)
- Scripts: `camelCase.js` (e.g., `seedDatabase.js`)

### Frontend
- Components: `PascalCase.jsx` (e.g., `Dashboard.jsx`)
- Contexts: `PascalCase.jsx` with `Context` suffix (e.g., `AuthContext.jsx`)
- Services: `camelCase.js` (e.g., `api.js`)
- Utilities: `camelCase.js` (e.g., `auditLogger.js`)

## Environment Files

### Backend `.env`
```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pharmacy_db
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5001/api
```

## Database Tables

1. **users** - User accounts
2. **medicines** - Medicine inventory
3. **categories** - Medicine categories
4. **suppliers** - Supplier information
5. **sales** - Sales transactions
6. **sale_items** - Sale line items
7. **stock_entries** - Stock purchases
8. **stock_entry_items** - Stock entry line items
9. **notifications** - System notifications
10. **audit_logs** - Activity logs
11. **settings** - System settings
12. **doctors** - Doctor information
13. **customer_requests** - Customer medicine requests

## API Endpoints

All API endpoints are prefixed with `/api`:

- `/api/auth/*` - Authentication
- `/api/users/*` - User management
- `/api/medicines/*` - Medicine inventory
- `/api/categories/*` - Categories
- `/api/suppliers/*` - Suppliers
- `/api/sales/*` - Sales
- `/api/stock-entries/*` - Stock entries
- `/api/notifications/*` - Notifications
- `/api/audit-logs/*` - Audit logs
- `/api/dashboard/*` - Dashboard stats
- `/api/settings/*` - Settings
- `/api/doctors/*` - Doctors
- `/api/customer-requests/*` - Customer requests

## Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## Build & Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Output: dist/ folder
```

## Notes

- Backend and frontend are completely separate
- No shared dependencies between frontend and backend
- Each has its own `package.json` and `node_modules`
- Communication via REST API only
- Frontend makes HTTP requests to backend API
