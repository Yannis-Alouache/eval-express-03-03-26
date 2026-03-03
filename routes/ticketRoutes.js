const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth.middleware');
const isPermitted = require('../middleware/role.middleware');

const allRoles = isPermitted('collaborateur', 'support', 'manager');

router.post('/', auth, isPermitted('collaborateur'), ticketController.createTicket);
// List all tickets
router.get('/', auth, allRoles, ticketController.listTickets);
// Get ticket by ID
router.get('/:id', auth, allRoles, ticketController.getTicket);
// Update ticket
router.put('/:id', auth, isPermitted('collaborateur'), ticketController.updateTicket);

module.exports = router;
