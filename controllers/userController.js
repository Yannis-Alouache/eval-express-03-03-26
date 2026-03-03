const bcrypt = require('bcrypt');
const { User } = require('../models');

const SALT_ROUNDS = 10;

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager_id } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required'
      });
    }

    // Validate role if provided
    const validRoles = ['collaborateur', 'support', 'manager'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Validate manager_id if provided
    if (manager_id) {
      const manager = await User.findByPk(manager_id);
      if (!manager) {
        return res.status(400).json({
          error: 'Manager not found'
        });
      }
    }

    // Hash password with salt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'collaborateur',
      manager_id: manager_id || null
    });

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      manager_id: user.manager_id,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle unique constraint violation (duplicate email)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createUser,
};
