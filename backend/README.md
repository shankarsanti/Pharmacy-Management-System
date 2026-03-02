# Pharmacy Management System - Backend

A comprehensive Node.js + Express + MySQL backend for pharmacy management.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Admin, Pharmacist, Manager roles)
- 💊 Medicine Inventory Management
- 📦 Stock Entry & Tracking
- 💰 Sales & Billing System
- 📊 Dashboard Statistics
- 🔔 Notifications (Low Stock, Expiry Alerts)
- 📝 Audit Logs
- 🏢 Supplier Management
- 📂 Category Management

## Tech Stack

- Node.js
- Express.js
- MySQL 2
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Database

Create a MySQL database:

```sql
CREATE DATABASE pharmacy_db;
```

### 3. Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pharmacy_db
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:5173
```

### 4. Initialize Database Schema

Run the SQL schema file:

```bash
mysql -u root -p pharmacy_db < config/schema.sql
```

Or manually execute the SQL commands from `config/schema.sql` in your MySQL client.

### 5. Seed Database (Optional)

Populate the database with initial data:

```bash
node scripts/seedDatabase.js
```

This creates:
- 2 users (Admin & Pharmacist)
- 8 categories
- 5 suppliers
- 5 sample medicines

### 6. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier (Admin)

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine (Admin)
- `GET /api/medicines/alerts/low-stock` - Get low stock medicines
- `GET /api/medicines/alerts/out-of-stock` - Get out of stock medicines
- `GET /api/medicines/alerts/expiring` - Get expiring medicines

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create sale
- `GET /api/sales/stats/dashboard` - Get sales statistics

### Stock Entries
- `GET /api/stock-entries` - Get all stock entries
- `GET /api/stock-entries/:id` - Get stock entry by ID
- `POST /api/stock-entries` - Create stock entry
- `DELETE /api/stock-entries/:id` - Delete stock entry (Admin)

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/generate` - Generate notifications

### Audit Logs (Admin only)
- `GET /api/audit-logs` - Get audit logs
- `POST /api/audit-logs` - Create audit log

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Default Login Credentials

After seeding:

**Admin:**
- Email: `admin@pharmacare.com`
- Password: `admin123`

**Pharmacist:**
- Email: `rahul@pharmacare.com`
- Password: `pharma123`

## Database Schema

The database includes the following tables:
- users
- categories
- suppliers
- medicines
- stock_entries
- stock_entry_items
- sales
- sale_items
- audit_logs
- notifications
- settings

See `config/schema.sql` for complete schema details.

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable protection

## Error Handling

All routes include comprehensive error handling with appropriate HTTP status codes and error messages.

## Development

The backend uses:
- `nodemon` for auto-reload during development
- Connection pooling for database efficiency
- Transaction support for data integrity
- Middleware for authentication and authorization

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up SSL/TLS for MySQL connection
5. Use a process manager like PM2
6. Set up proper logging
7. Configure firewall rules

## Support

For issues or questions, please refer to the main project documentation.
