const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/database');
const { User } = require("./User")

class Ticket extends Model {

  /**
   * Returns true if the user is the author of the ticket. False otherwise
   * @param {User} user
   */
  isUserAuthor(user) {
    // no db fetch
    return this.author_id === user.id;
  }
}

Ticket.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('bug', 'access', 'materiel', 'autre'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'low'
  },
  status: {
    type: DataTypes.ENUM('open', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled'),
    allowNull: false,
    defaultValue: 'open'
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Ticket',
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Ticket;
