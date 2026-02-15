module.exports = function (req, res, next) {
    // Check if user exists and has Admin role
    // Note: req.user is set by the auth middleware which must run before this
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
};
