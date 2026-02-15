const roleCheck = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                error: 'Access denied. Insufficient permissions.',
                requiredRole: requiredRole,
                userRole: req.user.role
            });
        }

        next();
    };
};

module.exports = roleCheck;
