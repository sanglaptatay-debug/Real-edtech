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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Project videos (simple in-memory storage for now)
let projectVideos = [
    {
        id: 1,
        title: 'AI Robot Demo',
        description: 'Student-built AI-powered robot',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
        id: 2,
        title: 'Drone Flight Show',
        description: 'Autonomous drone navigation project',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
        id: 3,
        title: '3D Printed Models',
        description: 'Student 3D printing showcase',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
];
let nextVideoId = 4;

app.get('/api/project-videos', (req, res) => {
    res.json(projectVideos);
});

app.post('/api/project-videos', (req, res) => {
    const newVideo = {
        id: nextVideoId++,
        title: req.body.title,
        description: req.body.description,
        embedUrl: req.body.embedUrl
    };
    projectVideos.push(newVideo);
    res.json({
        message: 'Video added successfully',
        video: newVideo
    });
});

app.put('/api/project-videos/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const index = projectVideos.findIndex(v => v.id === videoId);

    if (index === -1) {
        return res.status(404).json({ message: 'Video not found' });
    }

    projectVideos[index] = {
        ...projectVideos[index],
        ...req.body,
        id: videoId
    };

    res.json({
        message: 'Video updated successfully',
        video: projectVideos[index]
    });
});

app.delete('/api/project-videos/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const index = projectVideos.findIndex(v => v.id === videoId);

    if (index === -1) {
        return res.status(404).json({ message: 'Video not found' });
    }

    projectVideos.splice(index, 1);
    res.json({ message: 'Video deleted successfully' });
});

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
