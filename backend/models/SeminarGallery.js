const mongoose = require('mongoose');

const seminarGallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    caption: {
        type: String,
        default: '',
        trim: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SeminarGallery', seminarGallerySchema);
