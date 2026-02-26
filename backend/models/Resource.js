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
    resourceUrl: {
        type: String,
        required: [true, 'Resource URL is required'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
