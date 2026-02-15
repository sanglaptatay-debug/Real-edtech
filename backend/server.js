// Configure DNS servers to help with MongoDB Atlas connectivity
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const liveSessionRoutes = require('./routes/liveSessions');
const resourceRoutes = require('./routes/resources');
const galleryRoutes = require('./routes/gallery');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📢 ${req.method} ${req.url}`);
    next();
});

const path = require('path');

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/live-sessions', liveSessionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/web-projects', require('./routes/webProjects'));

app.use('/api/settings', require('./routes/settings'));

// Contact Information is now handled via /api/settings

// Project videos routes
app.use('/api/project-videos', require('./routes/projectVideos'));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Bengal Education Ventures API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            liveSessions: '/api/live-sessions',
            resources: '/api/resources',
            gallery: '/api/gallery'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: err.message || 'Something went wrong!',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🕒 Server updated at: ${new Date().toISOString()}`);
});
