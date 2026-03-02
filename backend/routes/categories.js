const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all categories
router.get('/', authenticate, async (req, res) => {
    try {
        const [categories] = await pool.query(`
            SELECT c.*, COUNT(m.id) as count 
            FROM categories c 
            LEFT JOIN medicines m ON c.id = m.category_id 
            GROUP BY c.id 
            ORDER BY c.name
        `);
        res.json({ success: true, categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
});

// Create category (Admin only)
router.post('/', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { name, description, color } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const id = 'C' + Date.now();
        await pool.query(
            'INSERT INTO categories (id, name, description, color) VALUES (?, ?, ?, ?)',
            [id, name, description, color || 'blue']
        );

        res.status(201).json({ success: true, message: 'Category created successfully', categoryId: id });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ success: false, message: 'Failed to create category' });
    }
});

// Update category (Admin only)
router.put('/:id', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const { id } = req.params;

        await pool.query(
            'UPDATE categories SET name = ?, description = ?, color = ? WHERE id = ?',
            [name, description, color, id]
        );

        res.json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ success: false, message: 'Failed to update category' });
    }
});

// Delete category (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete category' });
    }
});

module.exports = router;
