const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all suppliers
router.get('/', authenticate, async (req, res) => {
    try {
        const [suppliers] = await pool.query(`
            SELECT s.*, 
                   COUNT(DISTINCT se.id) as total_orders,
                   MAX(se.invoice_date) as last_order
            FROM suppliers s
            LEFT JOIN stock_entries se ON s.id = se.supplier_id
            GROUP BY s.id
            ORDER BY s.name
        `);
        res.json({ success: true, suppliers });
    } catch (error) {
        console.error('Get suppliers error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch suppliers' });
    }
});

// Create supplier
router.post('/', authenticate, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const { name, contact_person, phone, email, address, company, status } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Supplier name is required' });
        }

        const id = 'S' + Date.now();
        await pool.query(
            'INSERT INTO suppliers (id, name, contact_person, phone, email, address, company, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, contact_person, phone, email, address, company, status || 'Active']
        );

        res.status(201).json({ success: true, message: 'Supplier created successfully', supplierId: id });
    } catch (error) {
        console.error('Create supplier error:', error);
        res.status(500).json({ success: false, message: 'Failed to create supplier' });
    }
});

// Update supplier
router.put('/:id', authenticate, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const { name, contact_person, phone, email, address, company, status } = req.body;
        const { id } = req.params;

        await pool.query(
            'UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?, company = ?, status = ? WHERE id = ?',
            [name, contact_person, phone, email, address, company, status, id]
        );

        res.json({ success: true, message: 'Supplier updated successfully' });
    } catch (error) {
        console.error('Update supplier error:', error);
        res.status(500).json({ success: false, message: 'Failed to update supplier' });
    }
});

// Delete supplier
router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
        res.json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Delete supplier error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete supplier' });
    }
});

module.exports = router;
