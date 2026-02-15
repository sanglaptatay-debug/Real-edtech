const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const multer = require('multer');
const path = require('path');

// Configure Multer for Logo Upload
// Configure Multer for Logo Upload (Memory Storage)

// Configure Multer for Logo Upload (Memory Storage)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, png, webp, svg) are allowed!'));
        }
    }
});

// Get Settings (Public)
router.get('/', async (req, res) => {
    try {
        const settings = await SiteSettings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Update Settings (Admin Only)
router.put('/', auth, roleCheck('Admin'), upload.single('logo'), async (req, res) => {
    try {
        let settings = await SiteSettings.getSettings();

        // Update Logo if uploaded - Store as Base64 in DB
        if (req.file) {
            // Create Base64 string from memory buffer
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

            // Store in DB
            settings.logoUrl = base64Image;
        }

        // Update Contact Info & Dark Mode
        if (req.body.contactInfo) {
            // Handle both JSON string (from FormData) and object
            const contactData = typeof req.body.contactInfo === 'string'
                ? JSON.parse(req.body.contactInfo)
                : req.body.contactInfo;

            // Correctly update nested Mongoose object
            Object.assign(settings.contactInfo, contactData);
        }

        if (req.body.darkModeEnabled !== undefined) {
            settings.darkModeEnabled = req.body.darkModeEnabled === 'true' || req.body.darkModeEnabled === true;
        }

        settings.updatedAt = Date.now();
        await settings.save();

        res.json({
            message: 'Settings updated successfully',
            settings
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            error: 'Server error: ' + error.message
        });
    }
});

module.exports = router;
