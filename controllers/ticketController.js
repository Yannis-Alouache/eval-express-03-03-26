
const { Ticket } = require('../models');

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority, author_id, assigned_to, status } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      author_id,
      assigned_to,
      status
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all Tickets
exports.listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Ticket by ID
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    const { title, description, category, priority, author_id, assigned_to, status } = req.body;
    await ticket.update({ title, description, category, priority, author_id, assigned_to, status });
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

// Update Ticket Priority (Manager only)
exports.updateTicketPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const managerId = req.user.id;

    // Validate priority value
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
      });
    }

    // Find the ticket
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if manager can access this ticket:
    // 1. Manager is the author of the ticket, OR
    // 2. Ticket author is a team member of the manager
    const { User } = require('../models');
    const ticketAuthor = await User.findByPk(ticket.author_id);

    const isOwnTicket = ticket.author_id === managerId;
    const isTeamMemberTicket = ticketAuthor && ticketAuthor.manager_id === managerId;

    if (!isOwnTicket && !isTeamMemberTicket) {
      return res.status(403).json({
        error: 'You can only modify priority of tickets from your team or your own tickets'
      });
    }

    // Update priority
    await ticket.update({ priority });

    res.json({
      message: 'Ticket priority updated successfully',
      ticket: {
        id: ticket.id,
        title: ticket.title,
        priority: ticket.priority,
        updated_at: ticket.updated_at
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
