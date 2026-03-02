const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all sales
router.get('/', authenticate, async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;
        let query = `
            SELECT s.*, u.name as billed_by_name
            FROM sales s
            LEFT JOIN users u ON s.billed_by = u.id
        `;
        const params = [];

        if (startDate && endDate) {
            query += ' WHERE s.sale_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY s.sale_date DESC, s.sale_time DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [sales] = await pool.query(query, params);

        // Get items for each sale
        for (let sale of sales) {
            const [items] = await pool.query(`
                SELECT si.*, m.name as medicine_name
                FROM sale_items si
                LEFT JOIN medicines m ON si.medicine_id = m.id
                WHERE si.sale_id = ?
            `, [sale.id]);
            sale.items = items;
        }

        res.json({ success: true, sales });
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sales' });
    }
});

// Get sale by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const [sales] = await pool.query(`
            SELECT s.*, u.name as billed_by_name
            FROM sales s
            LEFT JOIN users u ON s.billed_by = u.id
            WHERE s.id = ?
        `, [req.params.id]);

        if (sales.length === 0) {
            return res.status(404).json({ success: false, message: 'Sale not found' });
        }

        const sale = sales[0];
        const [items] = await pool.query(`
            SELECT si.*, m.name as medicine_name
            FROM sale_items si
            LEFT JOIN medicines m ON si.medicine_id = m.id
            WHERE si.sale_id = ?
        `, [sale.id]);
        sale.items = items;

        res.json({ success: true, sale });
    } catch (error) {
        console.error('Get sale error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sale' });
    }
});

// Create sale
router.post('/', authenticate, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { customer_name, items, subtotal, tax, discount, total, payment_method } = req.body;
        
        console.log('Received sale data:', { customer_name, subtotal, tax, discount, total, payment_method, itemsCount: items?.length });

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Sale items are required' });
        }
        
        // Validate required numeric fields
        if (subtotal === undefined || subtotal === null) {
            return res.status(400).json({ success: false, message: 'Subtotal is required' });
        }
        if (total === undefined || total === null) {
            return res.status(400).json({ success: false, message: 'Total is required' });
        }

        const id = 'INV-' + Date.now();
        const now = new Date();
        const sale_date = now.toISOString().split('T')[0];
        const sale_time = now.toTimeString().split(' ')[0];

        await connection.query(
            `INSERT INTO sales (id, sale_date, sale_time, customer_name, subtotal, tax, discount, total, payment_method, billed_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, sale_date, sale_time, customer_name || 'Walk-in', subtotal, tax, discount, total, payment_method, req.user.id]
        );

        // Insert sale items and update stock
        for (const item of items) {
            await connection.query(
                `INSERT INTO sale_items (sale_id, medicine_id, quantity, price, sale_type, tablets_deducted)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [id, item.medicine_id, item.quantity, item.price, item.sale_type, item.tablets_deducted]
            );

            // Update medicine stock
            await connection.query(
                'UPDATE medicines SET stock = stock - ? WHERE id = ?',
                [item.tablets_deducted, item.medicine_id]
            );
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Sale completed successfully', saleId: id });
    } catch (error) {
        await connection.rollback();
        console.error('Create sale error:', error);
        res.status(500).json({ success: false, message: 'Failed to create sale' });
    } finally {
        connection.release();
    }
});

// Get sales statistics
router.get('/stats/dashboard', authenticate, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

        // Today's sales
        const [todaySales] = await pool.query(
            'SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM sales WHERE sale_date = ?',
            [today]
        );

        // This month's sales
        const [monthSales] = await pool.query(
            'SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM sales WHERE sale_date >= ?',
            [firstDayOfMonth]
        );

        // Recent sales
        const [recentSales] = await pool.query(`
            SELECT s.*, u.name as billed_by_name
            FROM sales s
            LEFT JOIN users u ON s.billed_by = u.id
            ORDER BY s.sale_date DESC, s.sale_time DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            stats: {
                today: todaySales[0],
                month: monthSales[0],
                recentSales
            }
        });
    } catch (error) {
        console.error('Get sales stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sales statistics' });
    }
});

module.exports = router;
