const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String, // SVG path or icon name
        default: ''
    },
    color: {
        type: String, // e.g., 'blue', 'green', 'purple'
        default: 'blue'
    },
    type: {
        type: String, // 'mission' or 'offering'
        enum: ['mission', 'offering'],
        default: 'offering'
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', ServiceSchema);
