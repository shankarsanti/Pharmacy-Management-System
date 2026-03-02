const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, role, phone, avatar, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// Create user (Admin only)
router.post('/', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = 'U' + Date.now();
        const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

        await pool.query(
            'INSERT INTO users (id, name, email, password, role, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, email, hashedPassword, role, phone, avatar]
        );

        res.status(201).json({ success: true, message: 'User created successfully', userId: id });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});

// Update user (Admin only)
router.put('/:id', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { name, email, role, phone, is_active } = req.body;
        const { id } = req.params;

        await pool.query(
            'UPDATE users SET name = ?, email = ?, role = ?, phone = ?, is_active = ? WHERE id = ?',
            [name, email, role, phone, is_active, id]
        );

        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});

module.exports = router;
