const mongoose = require('mongoose');

const webProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true
    },
    links: [{
        label: {
            type: String,
            required: [true, 'Link label is required'], // e.g., "GitHub", "Live Demo"
            trim: true
        },
        url: {
            type: String,
            required: [true, 'Link URL is required'],
            trim: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WebProject', webProjectSchema);
