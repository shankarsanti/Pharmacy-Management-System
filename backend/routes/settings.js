const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get all settings
router.get('/', authenticate, async (req, res) => {
    try {
        const [settings] = await pool.query('SELECT * FROM settings');
        
        // Convert array of settings to object
        const settingsObj = {};
        settings.forEach(setting => {
            try {
                // Try to parse JSON values
                settingsObj[setting.setting_key] = JSON.parse(setting.setting_value);
            } catch {
                // If not JSON, use as string
                settingsObj[setting.setting_key] = setting.setting_value;
            }
        });
        
        res.json({ success: true, settings: settingsObj });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
});

// Update settings
router.put('/', authenticate, async (req, res) => {
    try {
        // Only Admin and Manager can update settings
        if (req.user.role === 'Pharmacist') {
            return res.status(403).json({ success: false, message: 'Insufficient permissions' });
        }

        const settings = req.body;
        
        // Update each setting
        for (const [key, value] of Object.entries(settings)) {
            const settingValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            
            await pool.query(
                `INSERT INTO settings (setting_key, setting_value) 
                 VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE setting_value = ?`,
                [key, settingValue, settingValue]
            );
        }
        
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
});

// Get single setting by key
router.get('/:key', authenticate, async (req, res) => {
    try {
        const [settings] = await pool.query(
            'SELECT * FROM settings WHERE setting_key = ?',
            [req.params.key]
        );
        
        if (settings.length === 0) {
            return res.status(404).json({ success: false, message: 'Setting not found' });
        }
        
        let value;
        try {
            value = JSON.parse(settings[0].setting_value);
        } catch {
            value = settings[0].setting_value;
        }
        
        res.json({ success: true, setting: { key: settings[0].setting_key, value } });
    } catch (error) {
        console.error('Get setting error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch setting' });
    }
});

module.exports = router;
