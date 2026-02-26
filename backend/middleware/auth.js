const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user — check Student collection first, then admin User collection
        let user = await Student.findById(decoded.userId);
        let role = 'student';

        if (!user) {
            user = await User.findById(decoded.userId);
            if (user) {
                role = user.role || 'Admin';
            }
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request
        req.user = {
            userId: user._id,
            email: user.email,
            role: decoded.role || role,  // prefer the role from token
            enrolledCourses: user.enrolledCourses
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token, authentication failed' });
    }
};

module.exports = auth;

