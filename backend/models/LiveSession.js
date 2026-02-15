const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    sessionTitle: {
        type: String,
        required: [true, 'Session title is required'],
        trim: true
    },
    scheduledTime: {
        type: Date,
        required: [true, 'Scheduled time is required']
    },
    gmeetLink: {
        type: String,
        required: [true, 'Google Meet link is required'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LiveSession', liveSessionSchema);
