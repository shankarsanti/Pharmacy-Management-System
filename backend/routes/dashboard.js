const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

        // Total medicines
        const [totalMedicines] = await pool.query('SELECT COUNT(*) as count FROM medicines');

        // Low stock count
        const [lowStock] = await pool.query(
            'SELECT COUNT(*) as count FROM medicines WHERE stock > 0 AND stock <= low_stock_threshold'
        );

        // Out of stock count
        const [outOfStock] = await pool.query('SELECT COUNT(*) as count FROM medicines WHERE stock = 0');

        // Expiring soon (within 90 days)
        const [expiring] = await pool.query(`
            SELECT COUNT(*) as count FROM medicines 
            WHERE expiry_date > CURDATE() AND DATEDIFF(expiry_date, CURDATE()) <= 90
        `);

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

        // Total suppliers
        const [suppliers] = await pool.query('SELECT COUNT(*) as count FROM suppliers WHERE status = "Active"');

        // Total categories
        const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');

        // Recent sales
        const [recentSales] = await pool.query(`
            SELECT s.id, s.sale_date, s.sale_time, s.customer_name, s.total, s.payment_method, u.name as billed_by_name
            FROM sales s
            LEFT JOIN users u ON s.billed_by = u.id
            ORDER BY s.sale_date DESC, s.sale_time DESC
            LIMIT 5
        `);

        // Top selling medicines (this month)
        const [topMedicines] = await pool.query(`
            SELECT m.name, m.generic_name, SUM(si.tablets_deducted) as total_sold
            FROM sale_items si
            JOIN medicines m ON si.medicine_id = m.id
            JOIN sales s ON si.sale_id = s.id
            WHERE s.sale_date >= ?
            GROUP BY m.id
            ORDER BY total_sold DESC
            LIMIT 5
        `, [firstDayOfMonth]);

        res.json({
            success: true,
            stats: {
                inventory: {
                    total: totalMedicines[0].count,
                    lowStock: lowStock[0].count,
                    outOfStock: outOfStock[0].count,
                    expiring: expiring[0].count
                },
                sales: {
                    today: {
                        count: todaySales[0].count,
                        revenue: parseFloat(todaySales[0].revenue)
                    },
                    month: {
                        count: monthSales[0].count,
                        revenue: parseFloat(monthSales[0].revenue)
                    }
                },
                suppliers: suppliers[0].count,
                categories: categories[0].count,
                recentSales,
                topMedicines
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
    }
});

module.exports = router;
