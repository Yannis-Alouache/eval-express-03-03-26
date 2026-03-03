
const { Ticket, User, Comment } = require('../models');

// Helper: get user role
function getRole(user) {
  return user.role;
}

// Create Ticket (with business rules)
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, assigned_to, status } = req.body;
    const author_id = req.user.id;
    const role = getRole(req.user);
    // Collaborateur cannot create 'critical' ticket
    if (role === 'collaborateur' && priority === 'critical') {
      return res.status(403).json({ error: "Collaborateur can't create critical priority tickets" });
    }
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      author_id,
      assigned_to,
      status: status || 'open'
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List Tickets (visibility by role)
exports.listTickets = async (req, res) => {
  try {
    const role = getRole(req.user);
    let where = {};
    if (role === 'collaborateur') {
      where.author_id = req.user.id;
    } else if (role === 'manager') {
      // Get team member ids
      const team = await User.findAll({ where: { manager_id: req.user.id }, attributes: ['id'] });
      where.author_id = team.map(u => u.id);
    }
    // Support sees all
    const tickets = await Ticket.findAll({ where, include: ['comments', 'author', 'assignee'] });
    res.json(tickets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Ticket by ID (visibility by role)
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, { include: ['comments', 'author', 'assignee'] });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const role = getRole(req.user);
    if (role === 'collaborateur' && ticket.author_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (role === 'manager') {
      const team = await User.findAll({ where: { manager_id: req.user.id }, attributes: ['id'] });
      if (!team.map(u => u.id).includes(ticket.author_id)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Ticket (only manager can change priority, support cannot)
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const { title, description, category, priority, assigned_to, status } = req.body;
    const role = getRole(req.user);
    // Priority change rules
    if (priority && role !== 'manager') {
      return res.status(403).json({ error: 'Only manager can change priority' });
    }
    await ticket.update({ title, description, category, assigned_to, status, ...(priority && { priority }) });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    await ticket.destroy();
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
