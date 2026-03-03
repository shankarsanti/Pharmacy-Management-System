const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get all doctors
router.get('/', authenticate, async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT * FROM doctors ORDER BY name ASC');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
    }
});

// Create new doctor
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, specialization, phone } = req.body;
        
        if (!name) {
            return res.status(400).json({ success: false, message: 'Doctor name is required' });
        }

        const id = uuidv4();

        await pool.query(
            'INSERT INTO doctors (id, name, specialization, phone) VALUES (?, ?, ?, ?)',
            [id, name, specialization || null, phone || null]
        );

        res.status(201).json({ success: true, message: 'Doctor added successfully', id });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ success: false, message: 'Failed to create doctor' });
    }
});

// Update doctor
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialization, phone } = req.body;

        await pool.query(
            'UPDATE doctors SET name = ?, specialization = ?, phone = ? WHERE id = ?',
            [name, specialization || null, phone || null, id]
        );

        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ success: false, message: 'Failed to update doctor' });
    }
});

// Delete doctor
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
        res.json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ success: false, message: 'Failed to delete doctor' });
    }
});

module.exports = router;
