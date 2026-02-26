const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    summary: {
        type: String,
        required: [true, 'Course summary is required']
    },
    category: {
        type: String,
        enum: ['AI', 'Drone Technology', '3D Printing', 'Other'],
        required: [true, 'Course category is required']
    },
    image: {
        type: String,
        default: '' // URL to the course image
    },
    isPromoted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
