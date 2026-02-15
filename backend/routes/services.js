const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1, createdAt: -1 });
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Admin only
router.post('/', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { title, description, icon, color, order } = req.body;

        const newService = new Service({
            title,
            description,
            icon,
            color,
            order
        });

        const service = await newService.save();
        res.json(service);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Admin only
router.put('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { title, description, icon, color, order } = req.body;

        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { title, description, icon, color, order },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Admin only
router.delete('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json({ message: 'Service removed' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
