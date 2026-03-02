const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all stock entries
router.get('/', authenticate, async (req, res) => {
    try {
        const [entries] = await pool.query(`
            SELECT se.*, 
                   s.name as supplier_name,
                   u.name as entered_by_name
            FROM stock_entries se
            LEFT JOIN suppliers s ON se.supplier_id = s.id
            LEFT JOIN users u ON se.entered_by = u.id
            ORDER BY se.invoice_date DESC, se.created_at DESC
        `);

        // Get items for each entry
        for (let entry of entries) {
            const [items] = await pool.query(`
                SELECT sei.*, m.name as medicine_name
                FROM stock_entry_items sei
                LEFT JOIN medicines m ON sei.medicine_id = m.id
                WHERE sei.stock_entry_id = ?
            `, [entry.id]);
            entry.items = items;
        }

        res.json({ success: true, stockEntries: entries });
    } catch (error) {
        console.error('Get stock entries error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stock entries' });
    }
});

// Get stock entry by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const [entries] = await pool.query(`
            SELECT se.*, 
                   s.name as supplier_name,
                   u.name as entered_by_name
            FROM stock_entries se
            LEFT JOIN suppliers s ON se.supplier_id = s.id
            LEFT JOIN users u ON se.entered_by = u.id
            WHERE se.id = ?
        `, [req.params.id]);

        if (entries.length === 0) {
            return res.status(404).json({ success: false, message: 'Stock entry not found' });
        }

        const entry = entries[0];
        const [items] = await pool.query(`
            SELECT sei.*, m.name as medicine_name
            FROM stock_entry_items sei
            LEFT JOIN medicines m ON sei.medicine_id = m.id
            WHERE sei.stock_entry_id = ?
        `, [entry.id]);
        entry.items = items;

        res.json({ success: true, stockEntry: entry });
    } catch (error) {
        console.error('Get stock entry error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stock entry' });
    }
});

// Create stock entry
router.post('/', authenticate, authorize('Admin', 'Manager'), async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { supplier_id, invoice_number, invoice_date, payment_mode, items, remarks } = req.body;

        if (!supplier_id || !invoice_number || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        const id = 'SE' + Date.now();
        const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0);

        await connection.query(
            `INSERT INTO stock_entries (id, supplier_id, invoice_number, invoice_date, payment_mode, total_amount, total_quantity, remarks, entered_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, supplier_id, invoice_number, invoice_date, payment_mode, total_amount, total_quantity, remarks, req.user.id]
        );

        // Insert items and update medicine stock
        for (const item of items) {
            await connection.query(
                `INSERT INTO stock_entry_items (stock_entry_id, medicine_id, batch_number, strips_purchased, loose_tablets_purchased, tablets_per_strip, quantity, purchase_price, selling_price, mfg_date, expiry_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, item.medicine_id, item.batch_number, item.strips_purchased, item.loose_tablets_purchased, item.tablets_per_strip, item.quantity, item.purchase_price, item.selling_price, item.mfg_date, item.expiry_date]
            );

            // Update medicine stock and details
            await connection.query(
                `UPDATE medicines SET 
                    stock = stock + ?,
                    batch_number = ?,
                    expiry_date = ?,
                    purchase_price = ?,
                    selling_price = ?
                WHERE id = ?`,
                [item.quantity, item.batch_number, item.expiry_date, item.purchase_price, item.selling_price, item.medicine_id]
            );
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Stock entry created successfully', stockEntryId: id });
    } catch (error) {
        await connection.rollback();
        console.error('Create stock entry error:', error);
        res.status(500).json({ success: false, message: 'Failed to create stock entry' });
    } finally {
        connection.release();
    }
});

// Delete stock entry
router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;

        // Get items to reverse stock
        const [items] = await connection.query(
            'SELECT medicine_id, quantity FROM stock_entry_items WHERE stock_entry_id = ?',
            [id]
        );

        // Reverse stock quantities
        for (const item of items) {
            await connection.query(
                'UPDATE medicines SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.medicine_id]
            );
        }

        // Delete stock entry (items will be deleted by CASCADE)
        await connection.query('DELETE FROM stock_entries WHERE id = ?', [id]);

        await connection.commit();
        res.json({ success: true, message: 'Stock entry deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Delete stock entry error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete stock entry' });
    } finally {
        connection.release();
    }
});

module.exports = router;
