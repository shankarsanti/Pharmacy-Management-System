const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all notifications
router.get('/', authenticate, async (req, res) => {
    try {
        const [notifications] = await pool.query(
            'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
        );
        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark notification' });
    }
});

// Mark all as read
router.put('/read-all', authenticate, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE');
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark notifications' });
    }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await pool.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
});

// Generate notifications based on stock and expiry
router.post('/generate', authenticate, async (req, res) => {
    try {
        // Clear old notifications
        await pool.query('DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)');

        // Low stock notifications
        const [lowStock] = await pool.query(`
            SELECT id, name, stock, low_stock_threshold 
            FROM medicines 
            WHERE stock > 0 AND stock <= low_stock_threshold
        `);

        for (const med of lowStock) {
            const notifId = 'N' + Date.now() + Math.random().toString(36).substr(2, 9);
            await pool.query(
                `INSERT INTO notifications (id, type, title, message, severity) 
                 VALUES (?, 'low_stock', 'Low Stock Alert', ?, 'warning')`,
                [notifId, `${med.name} has only ${med.stock} tablets left`]
            );
        }

        // Out of stock notifications
        const [outOfStock] = await pool.query('SELECT id, name FROM medicines WHERE stock = 0');

        for (const med of outOfStock) {
            const notifId = 'N' + Date.now() + Math.random().toString(36).substr(2, 9);
            await pool.query(
                `INSERT INTO notifications (id, type, title, message, severity) 
                 VALUES (?, 'out_of_stock', 'Out of Stock', ?, 'critical')`,
                [notifId, `${med.name} is out of stock`]
            );
        }

        // Expiring soon notifications
        const [expiring] = await pool.query(`
            SELECT id, name, expiry_date, DATEDIFF(expiry_date, CURDATE()) as days_left
            FROM medicines 
            WHERE expiry_date > CURDATE() AND DATEDIFF(expiry_date, CURDATE()) <= 90
        `);

        for (const med of expiring) {
            const notifId = 'N' + Date.now() + Math.random().toString(36).substr(2, 9);
            const severity = med.days_left <= 30 ? 'warning' : 'info';
            await pool.query(
                `INSERT INTO notifications (id, type, title, message, severity) 
                 VALUES (?, 'expiry', 'Expiring Soon', ?, ?)`,
                [notifId, `${med.name} expires in ${med.days_left} days`, severity]
            );
        }

        res.json({ success: true, message: 'Notifications generated successfully' });
    } catch (error) {
        console.error('Generate notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate notifications' });
    }
});

module.exports = router;
