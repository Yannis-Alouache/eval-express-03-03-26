const { User } = require('../models');

/**
 * Middleware to check if user is a manager
 * Must be used after authMiddleware (requires req.user)
 */
const managerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'manager') {
    return res.status(403).json({
      error: 'Access denied. Manager role required.'
    });
  }

  next();
};

module.exports = managerOnly;
