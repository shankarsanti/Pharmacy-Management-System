const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all medicines
router.get('/', authenticate, async (req, res) => {
    try {
        const [medicines] = await pool.query(`
            SELECT m.*, 
                   c.name as category_name,
                   s.name as supplier_name
            FROM medicines m
            LEFT JOIN categories c ON m.category_id = c.id
            LEFT JOIN suppliers s ON m.supplier_id = s.id
            ORDER BY m.name
        `);
        res.json({ success: true, medicines });
    } catch (error) {
        console.error('Get medicines error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch medicines' });
    }
});

// Get medicine by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const [medicines] = await pool.query(`
            SELECT m.*, 
                   c.name as category_name,
                   s.name as supplier_name
            FROM medicines m
            LEFT JOIN categories c ON m.category_id = c.id
            LEFT JOIN suppliers s ON m.supplier_id = s.id
            WHERE m.id = ?
        `, [req.params.id]);

        if (medicines.length === 0) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        res.json({ success: true, medicine: medicines[0] });
    } catch (error) {
        console.error('Get medicine error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch medicine' });
    }
});

// Create medicine
router.post('/', authenticate, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const {
            name, generic_name, category_id, batch_number, supplier_id,
            purchase_price, selling_price, stock, expiry_date, added_date,
            medicine_type, tablets_per_strip, strip_price, loose_tablet_price,
            allow_loose_sale, low_stock_threshold
        } = req.body;

        if (!name || !purchase_price || !selling_price) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const id = 'M' + Date.now();
        await pool.query(
            `INSERT INTO medicines (
                id, name, generic_name, category_id, batch_number, supplier_id,
                purchase_price, selling_price, stock, expiry_date, added_date,
                medicine_type, tablets_per_strip, strip_price, loose_tablet_price,
                allow_loose_sale, low_stock_threshold
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, name, generic_name, category_id, batch_number, supplier_id,
                purchase_price, selling_price, stock || 0, expiry_date, added_date,
                medicine_type || 'Tablet', tablets_per_strip || 10, strip_price, loose_tablet_price,
                allow_loose_sale !== false, low_stock_threshold || 20
            ]
        );

        res.status(201).json({ success: true, message: 'Medicine created successfully', medicineId: id });
    } catch (error) {
        console.error('Create medicine error:', error);
        res.status(500).json({ success: false, message: 'Failed to create medicine' });
    }
});

// Update medicine
router.put('/:id', authenticate, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const {
            name, generic_name, category_id, batch_number, supplier_id,
            purchase_price, selling_price, stock, expiry_date,
            medicine_type, tablets_per_strip, strip_price, loose_tablet_price,
            allow_loose_sale, low_stock_threshold
        } = req.body;
        const { id } = req.params;

        await pool.query(
            `UPDATE medicines SET 
                name = ?, generic_name = ?, category_id = ?, batch_number = ?, supplier_id = ?,
                purchase_price = ?, selling_price = ?, stock = ?, expiry_date = ?,
                medicine_type = ?, tablets_per_strip = ?, strip_price = ?, loose_tablet_price = ?,
                allow_loose_sale = ?, low_stock_threshold = ?
            WHERE id = ?`,
            [
                name, generic_name, category_id, batch_number, supplier_id,
                purchase_price, selling_price, stock, expiry_date,
                medicine_type, tablets_per_strip, strip_price, loose_tablet_price,
                allow_loose_sale, low_stock_threshold, id
            ]
        );

        res.json({ success: true, message: 'Medicine updated successfully' });
    } catch (error) {
        console.error('Update medicine error:', error);
        res.status(500).json({ success: false, message: 'Failed to update medicine' });
    }
});

// Delete medicine
router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM medicines WHERE id = ?', [id]);
        res.json({ success: true, message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Delete medicine error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete medicine' });
    }
});

// Get low stock medicines
router.get('/alerts/low-stock', authenticate, async (req, res) => {
    try {
        const [medicines] = await pool.query(`
            SELECT m.*, c.name as category_name
            FROM medicines m
            LEFT JOIN categories c ON m.category_id = c.id
            WHERE m.stock > 0 AND m.stock <= m.low_stock_threshold
            ORDER BY m.stock ASC
        `);
        res.json({ success: true, medicines });
    } catch (error) {
        console.error('Get low stock error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch low stock medicines' });
    }
});

// Get out of stock medicines
router.get('/alerts/out-of-stock', authenticate, async (req, res) => {
    try {
        const [medicines] = await pool.query(`
            SELECT m.*, c.name as category_name
            FROM medicines m
            LEFT JOIN categories c ON m.category_id = c.id
            WHERE m.stock = 0
            ORDER BY m.name
        `);
        res.json({ success: true, medicines });
    } catch (error) {
        console.error('Get out of stock error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch out of stock medicines' });
    }
});

// Get expiring medicines
router.get('/alerts/expiring', authenticate, async (req, res) => {
    try {
        const days = req.query.days || 90;
        const [medicines] = await pool.query(`
            SELECT m.*, c.name as category_name,
                   DATEDIFF(m.expiry_date, CURDATE()) as days_until_expiry
            FROM medicines m
            LEFT JOIN categories c ON m.category_id = c.id
            WHERE m.expiry_date > CURDATE() 
            AND DATEDIFF(m.expiry_date, CURDATE()) <= ?
            ORDER BY m.expiry_date ASC
        `, [days]);
        res.json({ success: true, medicines });
    } catch (error) {
        console.error('Get expiring medicines error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch expiring medicines' });
    }
});

module.exports = router;
