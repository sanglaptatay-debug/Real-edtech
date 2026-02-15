const express = require('express');
const router = express.Router();
const LiveSession = require('../models/LiveSession');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all live sessions (Admin only)
router.get('/', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const sessions = await LiveSession.find()
            .populate('courseId', 'title category')
            .sort({ scheduledTime: 1 });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching all live sessions:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all live sessions for a course
router.get('/course/:courseId', async (req, res) => {
    try {
        const sessions = await LiveSession.find({ courseId: req.params.courseId })
            .populate('courseId', 'title category')
            .sort({ scheduledTime: 1 });

        res.json(sessions);
    } catch (error) {
        console.error('Error fetching live sessions:', error);
        res.status(500).json({ error: 'Server error while fetching live sessions' });
    }
});

// Get single session by ID
router.get('/:id', async (req, res) => {
    try {
        const session = await LiveSession.findById(req.params.id)
            .populate('courseId', 'title category');

        if (!session) {
            return res.status(404).json({ error: 'Live session not found' });
        }

        res.json(session);
    } catch (error) {
        console.error('Error fetching live session:', error);
        res.status(500).json({ error: 'Server error while fetching live session' });
    }
});

// Create new live session (Admin only)
router.post('/', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { courseId, sessionTitle, scheduledTime, gmeetLink } = req.body;

        if (!courseId || !sessionTitle || !scheduledTime || !gmeetLink) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const session = new LiveSession({
            courseId,
            sessionTitle,
            scheduledTime,
            gmeetLink
        });

        await session.save();

        const populatedSession = await LiveSession.findById(session._id)
            .populate('courseId', 'title category');

        res.status(201).json({
            message: 'Live session created successfully',
            session: populatedSession
        });
    } catch (error) {
        console.error('Error creating live session:', error);
        res.status(500).json({ error: 'Server error while creating live session' });
    }
});

// Update live session (Admin only)
router.put('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { sessionTitle, scheduledTime, gmeetLink } = req.body;

        const session = await LiveSession.findByIdAndUpdate(
            req.params.id,
            { sessionTitle, scheduledTime, gmeetLink },
            { new: true, runValidators: true }
        ).populate('courseId', 'title category');

        if (!session) {
            return res.status(404).json({ error: 'Live session not found' });
        }

        res.json({
            message: 'Live session updated successfully',
            session
        });
    } catch (error) {
        console.error('Error updating live session:', error);
        res.status(500).json({ error: 'Server error while updating live session' });
    }
});

// Delete live session (Admin only)
router.delete('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const session = await LiveSession.findByIdAndDelete(req.params.id);

        if (!session) {
            return res.status(404).json({ error: 'Live session not found' });
        }

        res.json({ message: 'Live session deleted successfully' });
    } catch (error) {
        console.error('Error deleting live session:', error);
        res.status(500).json({ error: 'Server error while deleting live session' });
    }
});

module.exports = router;
