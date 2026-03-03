const sequelize = require('../db/database');
const User = require('./User');
const Ticket = require('./Ticket');
const Comment = require('./Comment');

/*
Gestion de la hiérarchie
→ Un user peut être manager d’un autre user (manager_id)
*/
User.belongsTo(User, {as: 'manager',foreignKey: 'manager_id'});
User.hasMany(User, {as: 'team_members',foreignKey: 'manager_id'});

/*
Gestion des tickets
→ Un user peut créer plusieurs Tickets (auteur)
→ Un user peut être assigné à plusieurs Tickets (assignee)
*/
User.hasMany(Ticket, {as: 'authored_tickets',foreignKey: 'author_id'});
Ticket.belongsTo(User, {as: 'author',foreignKey: 'author_id'});
User.hasMany(Ticket, {as: 'assigned_tickets',foreignKey: 'assigned_to'});
Ticket.belongsTo(User, {as: 'assignee',foreignKey: 'assigned_to'});

/*
→ Un ticket peut avoir plusieurs commentaires
→ Un commentaire appartient à un ticket
→ Un commentaire est écrit par un user (author)
*/
Ticket.hasMany(Comment, {as: 'comments',foreignKey: 'ticket_id'});
Comment.belongsTo(Ticket, {as: 'ticket',foreignKey: 'ticket_id'});
User.hasMany(Comment, {as: 'comments',foreignKey: 'author_id'});
Comment.belongsTo(User, {as: 'author',foreignKey: 'author_id'});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
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
