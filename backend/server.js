const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const supplierRoutes = require('./routes/suppliers');
const medicineRoutes = require('./routes/medicines');
const salesRoutes = require('./routes/sales');
const stockEntryRoutes = require('./routes/stockEntries');
const auditLogRoutes = require('./routes/auditLogs');
const notificationRoutes = require('./routes/notifications');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');
const customerRequestRoutes = require('./routes/customerRequests');
const doctorRoutes = require('./routes/doctors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allow multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Pharmacy API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stock-entries', stockEntryRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/customer-requests', customerRequestRoutes);
app.use('/api/doctors', doctorRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await testConnection();
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on port ${PORT}`);
            console.log(`📍 API URL: http://localhost:${PORT}`);
            console.log(`🏥 Pharmacy Management System Backend\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
