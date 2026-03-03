
const { Ticket, User} = require('../models');
const {canTicketPassToStatus} = require("../utils/ticketUtils");

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

// Update ticket's status
exports.editStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const newStatus = req.query.status

    if( !newStatus ) {
      return res.status(400).json({
        status: false,
        error: "Please provide a status in order to change this ticket's status."
      })
    }

    const currentUser = await User.findByPk(req.user.id);

    if( !currentUser ) {
      throw new Error("Please log in to edit that ticket's status.")
    }

    if( !canTicketPassToStatus(newStatus, ticket, currentUser) ) {
      return res.status(409).json({
        status: false,
        error: `This ticket cannot pass to status '${newStatus}'.`
      })
    }

    const updatedTicket = await ticket.update({
      status: newStatus
    })

    res.status(200).json({
      status: true,
      message: "Ticket status updated successfully.",
      ticket: updatedTicket
    })
  } catch (e) {
    res.status(500).json({
      status: false,
      error: "Unknown error when updating this tickets' status. Please try again.",
    })
  }
}