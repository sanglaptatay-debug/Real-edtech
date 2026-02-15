const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    logoUrl: {
        type: String,
        default: ''
    },
    darkModeEnabled: {
        type: Boolean,
        default: true
    },
    contactInfo: {
        email: { type: String, default: 'info@bengaledu.com' },
        tagline: { type: String, default: 'Building future-ready skills' },
        phone: { type: String, default: '+91 1234567890' },
        address: { type: String, default: 'West Bengal, India' },
        organization: { type: String, default: 'BIOROBODRAI' },
        youtubeLink: { type: String, default: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    },
    siteContent: {
        aboutSubtitle: { type: String, default: 'We are empowering the youth of Bengal' },
        visionText: { type: String, default: 'We are empowering the youth of Bengal. We are charging a minimal amount to ensure the sustainability and continuity of our operations.' }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure only one document exists
SiteSettingsSchema.statics.getSettings = async function () {
    try {
        let settings = await this.findOne();
        if (!settings) {
            console.log('No settings found. Creating default settings...');
            settings = await this.create({});
            console.log('Default settings created:', settings);
        }
        return settings;
    } catch (error) {
        console.error('Error in SiteSettings.getSettings:', error);
        throw error;
    }
};

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
