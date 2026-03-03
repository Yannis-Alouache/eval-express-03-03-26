const sequelize = require('../db/database');
const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');

// User associations
// A user can be managed by a manager (self-referencing)
User.belongsTo(User, {
  as: 'manager',
  foreignKey: 'manager_id'
});

User.hasMany(User, {
  as: 'team_members',
  foreignKey: 'manager_id'
});

// User has many tickets as author
User.hasMany(Ticket, {
  as: 'authored_tickets',
  foreignKey: 'author_id'
});

Ticket.belongsTo(User, {
  as: 'author',
  foreignKey: 'author_id'
});

// User has many tickets as assignee
User.hasMany(Ticket, {
  as: 'assigned_tickets',
  foreignKey: 'assigned_to'
});

Ticket.belongsTo(User, {
  as: 'assignee',
  foreignKey: 'assigned_to'
});

// Ticket has many comments
Ticket.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'ticket_id'
});

Comment.belongsTo(Ticket, {
  as: 'ticket',
  foreignKey: 'ticket_id'
});

// User has many comments
User.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'author_id'
});

Comment.belongsTo(User, {
  as: 'author',
  foreignKey: 'author_id'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Ticket,
  Comment,
  syncDatabase
};
