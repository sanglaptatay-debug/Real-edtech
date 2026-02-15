const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage (Memory storage for Base64)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Get all courses (public)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 });

        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Server error while fetching courses' });
    }
});

// Get single course by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('createdBy', 'fullName email');

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ error: 'Server error while fetching course' });
    }
});

// Create new course (Admin only)
router.post('/', auth, roleCheck('Admin'), upload.single('image'), async (req, res) => {
    try {
        // req.body fields will be available here
        const { title, summary, category, googleFormLink } = req.body;

        if (!title || !summary || !category) {
            return res.status(400).json({ error: 'Title, summary, and category are required' });
        }

        const courseData = {
            title,
            summary,
            category,
            googleFormLink: googleFormLink || '',
            createdBy: req.user.userId
        };

        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            courseData.image = base64Image;
        }

        const course = new Course(courseData);
        await course.save();

        const populatedCourse = await Course.findById(course._id)
            .populate('createdBy', 'fullName email');

        res.status(201).json({
            message: 'Course created successfully',
            course: populatedCourse
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Server error while creating course' });
    }
});

// Update course (Admin only)
router.put('/:id', auth, roleCheck('Admin'), upload.single('image'), async (req, res) => {
    try {
        const { title, summary, category, googleFormLink } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (summary) updateData.summary = summary;
        if (category) updateData.category = category;
        if (googleFormLink !== undefined) updateData.googleFormLink = googleFormLink;

        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            updateData.image = base64Image;
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'fullName email');

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Server error while updating course' });
    }
});

// Delete course (Admin only)
router.delete('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Optional: Delete image file
        // if (course.image && course.image.startsWith('/uploads/')) {
        //      // fs.unlink implementation...
        // }

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Server error while deleting course' });
    }
});

module.exports = router;
