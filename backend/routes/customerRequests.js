const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all customer requests
router.get('/', authenticate, async (req, res) => {
    try {
        const [requests] = await pool.query(`
            SELECT cr.*, u.name as requested_by_name
            FROM customer_requests cr
            LEFT JOIN users u ON cr.requested_by = u.id
            ORDER BY cr.created_at DESC
        `);
        res.json({ success: true, requests });
    } catch (error) {
        console.error('Error fetching customer requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch customer requests' });
    }
});

// Create new customer request
router.post('/', authenticate, async (req, res) => {
    try {
        const { medicine_name, generic_name, customer_name, customer_phone, notes } = req.body;
        
        if (!medicine_name) {
            return res.status(400).json({ success: false, message: 'Medicine name is required' });
        }

        const id = uuidv4();
        const requested_date = new Date().toISOString().split('T')[0];

        await pool.query(
            `INSERT INTO customer_requests 
            (id, medicine_name, generic_name, customer_name, customer_phone, notes, requested_by, requested_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [id, medicine_name, generic_name || null, customer_name || null, customer_phone || null, notes || null, req.user.id, requested_date]
        );

        res.status(201).json({ success: true, message: 'Customer request added successfully', id });
    } catch (error) {
        console.error('Error creating customer request:', error);
        res.status(500).json({ success: false, message: 'Failed to create customer request' });
    }
});

// Update customer request
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { medicine_name, generic_name, customer_name, customer_phone, notes, status } = req.body;

        await pool.query(
            `UPDATE customer_requests 
            SET medicine_name = ?, generic_name = ?, customer_name = ?, customer_phone = ?, notes = ?, status = ?
            WHERE id = ?`,
            [medicine_name, generic_name || null, customer_name || null, customer_phone || null, notes || null, status || 'Pending', id]
        );

        res.json({ success: true, message: 'Customer request updated successfully' });
    } catch (error) {
        console.error('Error updating customer request:', error);
        res.status(500).json({ success: false, message: 'Failed to update customer request' });
    }
});

// Delete customer request
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM customer_requests WHERE id = ?', [id]);
        res.json({ success: true, message: 'Customer request deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer request:', error);
        res.status(500).json({ success: false, message: 'Failed to delete customer request' });
    }
});

module.exports = router;
