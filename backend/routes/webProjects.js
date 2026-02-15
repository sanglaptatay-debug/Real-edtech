const express = require('express');
const router = express.Router();
const WebProject = require('../models/WebProject');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all web projects (Public)
router.get('/', async (req, res) => {
    try {
        const projects = await WebProject.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching web projects:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new web project (Protected: Admin only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const { title, description, links } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const newProject = new WebProject({
            title,
            description,
            links: links || []
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating web project:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update web project (Protected: Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const { title, description, links } = req.body;

        const project = await WebProject.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.links = links || project.links;

        await project.save();
        res.json(project);
    } catch (error) {
        console.error('Error updating web project:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete web project (Protected: Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const project = await WebProject.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await project.deleteOne();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting web project:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
