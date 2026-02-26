const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

// Helper function for password validation
const validatePassword = (password) => {
    const minLength = 8;
    const minNumbers = 3;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const numberCount = (password.match(/\d/g) || []).length;

    if (password.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    if (numberCount < minNumbers) return 'Password must contain at least 3 numbers';

    return null;
};

// Register new student
router.post('/register', async (req, res) => {
    console.log('📝 Registration request received:', req.body);
    try {
        const { fullName, email, password } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new student
        const student = new Student({
            fullName,
            email,
            password // Will be hashed by the pre-save hook
        });

        await student.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: student._id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Student registered successfully',
            token,
            user: {
                id: student._id,
                fullName: student.fullName,
                email: student.email,
                role: 'student'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});


// Login (supports both students and admin users)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Try to find in students collection first
        let user = await Student.findOne({ email });
        let role = 'student';

        // If not found in students, check users (for admins)
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                role = user.role || 'Admin'; // ensure consistent casing
            }
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login for students
        if (role === 'student') {
            user.lastLogin = new Date();
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: role,
                enrolledCourses: user.enrolledCourses || []
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all admin users (Protected: Admin only)
router.get('/admins', auth, admin, async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' }).select('-passwordHash');
        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register new API Admin (Protected: Admin only)
router.post('/register-admin', auth, admin, async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new admin user
        const user = new User({
            fullName,
            email,
            passwordHash: password, // Will be hashed by pre-save hook
            role: 'Admin'
        });

        await user.save();

        res.status(201).json({
            message: 'Admin user created successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ error: 'Server error during admin registration' });
    }
});

// Reset Admin Password (Protected: Admin only)
router.put('/admins/:id/password', auth, admin, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update password (pre-save hook will hash it)
        user.passwordHash = password;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete Admin (Protected: Admin only)
router.delete('/admins/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prevent deleting self (optional but good practice)
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({ error: 'Cannot delete yourself' });
        }

        await user.deleteOne();
        res.json({ message: 'Admin user deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
