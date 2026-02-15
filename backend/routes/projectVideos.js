const express = require('express');
const router = express.Router();
const ProjectVideo = require('../models/ProjectVideo');
// Assuming we might want to protect these routes later, but adhering to current server.js logic which seems open/semi-open or check if auth is needed. 
// The original server.js didn't have auth middleware on the video routes, but the user asked to save until *I* change them, implying admin control. 
// However, to keep parity with previous simple implementation first, I will implement standard CRUD.
// I will check if I should add auth. The original server.js didn't use 'auth' for videos, just open endpoints.
// But usually settings/videos should be protected.
// For now I will replicate the functionality but backed by DB.

// Get all videos
router.get('/', async (req, res) => {
    try {
        const videos = await ProjectVideo.find().sort({ createdAt: 1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new video
router.post('/', async (req, res) => {
    const video = new ProjectVideo({
        title: req.body.title,
        description: req.body.description,
        embedUrl: req.body.embedUrl
    });

    try {
        const newVideo = await video.save();
        res.status(201).json({
            message: 'Video added successfully',
            video: newVideo
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update video
router.put('/:id', async (req, res) => {
    try {
        const video = await ProjectVideo.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        if (req.body.title) video.title = req.body.title;
        if (req.body.description) video.description = req.body.description;
        if (req.body.embedUrl) video.embedUrl = req.body.embedUrl;

        const updatedVideo = await video.save();
        res.json({
            message: 'Video updated successfully',
            video: updatedVideo
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete video
router.delete('/:id', async (req, res) => {
    try {
        const video = await ProjectVideo.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        await video.deleteOne();
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
