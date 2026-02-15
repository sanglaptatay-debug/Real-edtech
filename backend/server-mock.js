require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Configure multer for memory storage (mock mode)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for testing
const mockCourses = [
    {
        _id: '1',
        title: 'Introduction to Artificial Intelligence',
        summary: 'Learn the fundamentals of AI, machine learning, and deep learning. Build intelligent systems and understand how AI is transforming industries.',
        category: 'AI',
        googleFormLink: 'https://forms.google.com/ai-course',
        createdAt: new Date()
    },
    {
        _id: '2',
        title: 'Drone Technology & Operations',
        summary: 'Master drone programming, flight operations, and real-world applications. Learn about aerial photography, mapping, and autonomous flight systems.',
        category: 'Drone Technology',
        googleFormLink: 'https://forms.google.com/drone-course',
        createdAt: new Date()
    },
    {
        _id: '3',
        title: '3D Printing & Prototyping',
        summary: 'Explore additive manufacturing, 3D modeling, and rapid prototyping. Create physical objects from digital designs and understand modern manufacturing.',
        category: '3D Printing',
        googleFormLink: 'https://forms.google.com/3dprinting-course',
        createdAt: new Date()
    }
];

const mockSessions = [
    {
        _id: '1',
        courseId: '1',
        sessionTitle: 'Introduction AI',
        scheduledTime: new Date('2026-02-20T10:00:00'),
        gmeetLink: 'https://meet.google.com/ai-session-1'
    },
    {
        _id: '2',
        courseId: '2',
        sessionTitle: 'Drone Flight Basics',
        scheduledTime: new Date('2026-02-21T15:00:00'),
        gmeetLink: 'https://meet.google.com/drone-session-1'
    }
];

// Mock gallery images (in-memory for this session)
let mockGallery = [
    {
        _id: '1',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzRGNDZFNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QUkgV29ya3Nob3A8L3RleHQ+PC9zdmc+',
        caption: 'AI Workshop - Students learning machine learning basics',
        uploadedAt: new Date('2024-01-15')
    },
    {
        _id: '2',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzEwQjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RHJvbmUgVHJhaW5pbmc8L3RleHQ+PC9zdmc+',
        caption: 'Drone Flight Training Session',
        uploadedAt: new Date('2024-01-20')
    },
    {
        _id: '3',
        imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzhCNUNGNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+M0QgUHJpbnRpbmc8L3RleHQ+PC9zdmc+',
        caption: '3D Printing Workshop - Creating prototypes',
        uploadedAt: new Date('2024-02-01')
    }
];

// Contact information (editable by admin)
let contactInfo = {
    email: 'info@bengaledu.com',
    tagline: 'Building future-ready skills',
    phone: '+91 1234567890',
    address: 'West Bengal, India',
    organization: 'BIOROBODRAI',
    youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
};

// Project videos (editable by admin)
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
        description: 'Autonomous drone choreography',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
        id: 3,
        title: '3D Printed Models',
        description: 'Complex architectural models',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
];
let nextVideoId = 4;

// Mock Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Bengal Education Ventures API (Mock Mode)',
        note: 'Using mock data - MongoDB connection pending'
    });
});

// Get all courses
app.get('/api/courses', (req, res) => {
    res.json(mockCourses);
});

// Get course by ID
app.get('/api/courses/:id', (req, res) => {
    const course = mockCourses.find(c => c._id === req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

// Get sessions for a course
app.get('/api/live-sessions/course/:courseId', (req, res) => {
    const sessions = mockSessions.filter(s => s.courseId === req.params.courseId);
    res.json(sessions);
});

// Get all sessions
app.get('/api/live-sessions', (req, res) => {
    res.json(mockSessions);
});

// Create new session
app.post('/api/live-sessions', (req, res) => {
    const newSession = {
        _id: 'session_' + Date.now(),
        ...req.body,
        scheduledTime: new Date(req.body.scheduledTime)
    };
    mockSessions.push(newSession);
    res.status(201).json({
        message: 'Session created successfully',
        session: newSession
    });
});

// Update session
app.put('/api/live-sessions/:id', (req, res) => {
    const index = mockSessions.findIndex(s => s._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Session not found' });
    }

    mockSessions[index] = {
        ...mockSessions[index],
        ...req.body,
        scheduledTime: new Date(req.body.scheduledTime)
    };

    res.json({
        message: 'Session updated successfully',
        session: mockSessions[index]
    });
});

// Delete session
app.delete('/api/live-sessions/:id', (req, res) => {
    const index = mockSessions.findIndex(s => s._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Session not found' });
    }

    mockSessions.splice(index, 1);
    res.json({ message: 'Session deleted successfully' });
});

// Get gallery
app.get('/api/gallery', (req, res) => {
    res.json(mockGallery);
});

// Delete from gallery
app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    const index = mockGallery.findIndex(img => img._id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Image not found' });
    }

    mockGallery.splice(index, 1);
    res.json({ message: 'Image deleted successfully' });
});

// Get contact information
app.get('/api/contact', (req, res) => {
    res.json(contactInfo);
});

// Update contact information
app.put('/api/contact', (req, res) => {
    contactInfo = {
        ...contactInfo,
        ...req.body
    };
    res.json({
        message: 'Contact information updated successfully',
        contact: contactInfo
    });
});

// Get all project videos
app.get('/api/project-videos', (req, res) => {
    res.json(projectVideos);
});

// Create new project video
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

// Update project video
app.put('/api/project-videos/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const index = projectVideos.findIndex(v => v.id === videoId);

    if (index === -1) {
        return res.status(404).json({ message: 'Video not found' });
    }

    projectVideos[index] = {
        ...projectVideos[index],
        ...req.body,
        id: videoId // Preserve the ID
    };

    res.json({
        message: 'Video updated successfully',
        video: projectVideos[index]
    });
});

// Delete project video
app.delete('/api/project-videos/:id', (req, res) => {
    const videoId = parseInt(req.params.id);
    const index = projectVideos.findIndex(v => v.id === videoId);

    if (index === -1) {
        return res.status(404).json({ message: 'Video not found' });
    }

    projectVideos.splice(index, 1);
    res.json({ message: 'Video deleted successfully' });
});

// Upload to gallery (mock)
app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert uploaded file to base64 data URL - this makes the real image display!
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const newImage = {
        _id: 'mock_' + Date.now(),
        imageUrl: dataUrl,  // Your actual uploaded photo!
        caption: req.body.caption || 'Uploaded Image',
        uploadedAt: new Date()
    };

    mockGallery.unshift(newImage); // Add to beginning

    res.status(201).json({
        message: 'Image uploaded successfully - showing your actual image!',
        image: newImage
    });
});

// Auth routes (mock)
app.post('/api/auth/register', (req, res) => {
    res.status(201).json({
        message: 'User registered successfully',
        token: 'mock_jwt_token_' + Date.now(),
        user: {
            id: 'mock_user_id',
            fullName: req.body.fullName,
            email: req.body.email,
            role: 'Student',
            enrolledCourses: []
        }
    });
});

app.post('/api/auth/login', (req, res) => {
    if (req.body.email === 'admin@bengaledu.com' && req.body.password === 'Admin@123') {
        res.json({
            message: 'Login successful',
            token: 'mock_jwt_token_admin',
            user: {
                id: 'admin_id',
                fullName: 'Bengal Admin',
                email: 'admin@bengaledu.com',
                role: 'Admin',
                enrolledCourses: []
            }
        });
    } else {
        res.json({
            message: 'Login successful',
            token: 'mock_jwt_token_student',
            user: {
                id: 'student_id',
                fullName: req.body.email.split('@')[0],
                email: req.body.email,
                role: 'Student',
                enrolledCourses: ['1', '2']
            }
        });
    }
});

// Resources (mock)
app.get('/api/resources/course/:courseId', (req, res) => {
    res.json([
        {
            _id: '1',
            resourceName: 'Course Introduction PDF',
            resourceUrl: 'https://example.com/intro.pdf'
        },
        {
            _id: '2',
            resourceName: 'Practice Exercises',
            resourceUrl: 'https://example.com/exercises.pdf'
        }
    ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT + ' (MOCK MODE)');
    console.log('⚠️  Using mock data - MongoDB connection will be configured later');
    console.log('📍 Environment: ' + process.env.NODE_ENV);
});
