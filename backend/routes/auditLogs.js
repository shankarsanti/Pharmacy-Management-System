const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all audit logs (Admin only)
router.get('/', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { type, startDate, endDate, limit } = req.query;
        let query = `
            SELECT al.*, u.name as user_name
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (type) {
            query += ' AND al.log_type = ?';
            params.push(type);
        }

        if (startDate && endDate) {
            query += ' AND DATE(al.created_at) BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY al.created_at DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        } else {
            query += ' LIMIT 100';
        }

        const [logs] = await pool.query(query, params);
        res.json({ success: true, logs });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    }
});

// Create audit log
router.post('/', authenticate, async (req, res) => {
    try {
        const { action, description, log_type } = req.body;

        if (!action || !description) {
            return res.status(400).json({ success: false, message: 'Action and description are required' });
        }

        const id = 'L' + Date.now();
        await pool.query(
            'INSERT INTO audit_logs (id, action, description, user_id, user_role, log_type) VALUES (?, ?, ?, ?, ?, ?)',
            [id, action, description, req.user.id, req.user.role, log_type || 'system']
        );

        res.status(201).json({ success: true, message: 'Audit log created successfully' });
    } catch (error) {
        console.error('Create audit log error:', error);
        res.status(500).json({ success: false, message: 'Failed to create audit log' });
    }
});

module.exports = router;
