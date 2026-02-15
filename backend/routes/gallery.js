const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const SeminarGallery = require('../models/SeminarGallery');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'seminar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Get all seminar gallery images (public)
router.get('/', async (req, res) => {
    try {
        const images = await SeminarGallery.find()
            .populate('uploadedBy', 'fullName')
            .sort({ createdAt: -1 });

        res.json(images);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ error: 'Server error while fetching gallery images' });
    }
});

// Upload new image (Admin only)
router.post('/upload', auth, roleCheck('Admin'), upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const { caption } = req.body;

        const galleryItem = new SeminarGallery({
            imageUrl: '/uploads/' + req.file.filename,
            caption: caption || '',
            uploadedBy: req.user.userId
        });

        await galleryItem.save();

        const populatedItem = await SeminarGallery.findById(galleryItem._id)
            .populate('uploadedBy', 'fullName');

        res.status(201).json({
            message: 'Image uploaded successfully',
            gallery: populatedItem
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Server error while uploading image' });
    }
});

// Update gallery image (Admin only)
router.put('/:id', auth, roleCheck('Admin'), upload.single('image'), async (req, res) => {
    try {
        let galleryItem = await SeminarGallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        // If a new file is uploaded, update imageUrl
        if (req.file) {
            // Optional: Delete old file here (implementation depends on storage needs)
            galleryItem.imageUrl = '/uploads/' + req.file.filename;
        }

        // Update caption if provided
        if (req.body.caption !== undefined) {
            galleryItem.caption = req.body.caption;
        }

        await galleryItem.save();

        const populatedItem = await SeminarGallery.findById(galleryItem._id)
            .populate('uploadedBy', 'fullName');

        res.json({
            message: 'Gallery image updated successfully',
            gallery: populatedItem
        });
    } catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({ error: 'Server error while updating gallery image' });
    }
});

// Delete gallery image (Admin only)
router.delete('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const galleryItem = await SeminarGallery.findByIdAndDelete(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        // Optional: Delete the actual file from the filesystem
        // const fs = require('fs');
        // const filePath = path.join(__dirname, '..', galleryItem.imageUrl);
        // if (fs.existsSync(filePath)) {
        //   fs.unlinkSync(filePath);
        // }

        res.json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Server error while deleting gallery image' });
    }
});

module.exports = router;
