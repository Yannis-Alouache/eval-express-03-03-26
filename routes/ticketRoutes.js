const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth.middleware');


// Create ticket
router.post('/', ticketController.createTicket);
// List all tickets
router.get('/', ticketController.listTickets);
// Get ticket by ID
router.get('/:id', ticketController.getTicket);
// Update ticket
router.put('/:id', ticketController.updateTicket);
// Update status
router.patch('/:id/status', ticketController.updateStatus);
// Delete ticket
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
