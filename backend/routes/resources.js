const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for resource file uploads
const uploadDir = path.join(__dirname, '../uploads/resources');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
    fileFilter: (req, file, cb) => {
        // Allow common document types
        const allowed = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpg', '.jpeg', '.zip'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('File type not allowed'));
    }
});


// Get all resources for a course (requires authentication)
router.get('/course/:courseId', auth, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Allow admins to access all resources
        if (req.user.role !== 'Admin') {
            // Check if student is enrolled in this course with flag = 'Y'
            const enrolledCourses = req.user.enrolledCourses || [];
            const isEnrolled = enrolledCourses.some(enrollment => {
                if (typeof enrollment === 'string') return enrollment === courseId;
                const id = enrollment.courseId?._id || enrollment.courseId;
                return id?.toString() === courseId && enrollment.flag === 'Y';
            });

            if (!isEnrolled) {
                return res.status(403).json({
                    error: 'Access denied. You must be enrolled in this course to view resources.'
                });
            }
        }

        const resources = await Resource.find({ courseId })
            .populate('courseId', 'title category')
            .sort({ createdAt: -1 });

        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Server error while fetching resources' });
    }
});

// Create new resource via URL (Admin only)
router.post('/', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { courseId, resourceName, resourceUrl } = req.body;

        if (!courseId || !resourceName || !resourceUrl) {
            return res.status(400).json({ error: 'courseId, resourceName, and resourceUrl are required' });
        }

        const resource = new Resource({
            courseId,
            resourceName,
            resourceType: 'url',
            resourceUrl
        });

        await resource.save();
        const populatedResource = await Resource.findById(resource._id).populate('courseId', 'title category');

        res.status(201).json({ message: 'Resource created successfully', resource: populatedResource });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ error: 'Server error while creating resource' });
    }
});

// Upload file resource (Admin only)
router.post('/upload', auth, roleCheck('Admin'), upload.single('file'), async (req, res) => {
    try {
        const { courseId, resourceName } = req.body;

        if (!courseId || !resourceName) {
            return res.status(400).json({ error: 'courseId and resourceName are required' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = `/uploads/resources/${req.file.filename}`;

        const resource = new Resource({
            courseId,
            resourceName,
            resourceType: 'file',
            filePath
        });

        await resource.save();
        const populatedResource = await Resource.findById(resource._id).populate('courseId', 'title category');

        res.status(201).json({ message: 'File uploaded and resource created', resource: populatedResource });
    } catch (error) {
        console.error('Error uploading file resource:', error);
        res.status(500).json({ error: 'Server error while uploading resource file' });
    }
});

// Update resource (Admin only)
router.put('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { resourceName, resourceUrl } = req.body;

        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { resourceName, resourceUrl },
            { new: true, runValidators: true }
        ).populate('courseId', 'title category');

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json({
            message: 'Resource updated successfully',
            resource
        });
    } catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).json({ error: 'Server error while updating resource' });
    }
});

// Delete resource (Admin only)
router.delete('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ error: 'Server error while deleting resource' });
    }
});

module.exports = router;
