
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
