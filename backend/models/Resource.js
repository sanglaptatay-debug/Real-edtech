const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    resourceName: {
        type: String,
        required: [true, 'Resource name is required'],
        trim: true
    },
    resourceType: {
        type: String,
        enum: ['url', 'file'],
        default: 'url'
    },
    resourceUrl: {
        type: String,
        trim: true,
        default: ''
    },
    filePath: {
        type: String,
        default: '' // Path to uploaded file on server
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
