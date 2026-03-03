const express = require('express');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth.middleware');
const isPermitted = require('../middleware/role.middleware');

const router = express.Router();

const allRoles = isPermitted('collaborateur', 'support', 'manager');

router.get('/:ticketId/comments', auth, allRoles, commentController.getAllCommentsByTicket);
router.post('/:ticketId/comments', auth, allRoles, commentController.createCommentOnTicket);
router.put('/:ticketId/comments/:id', auth, allRoles, commentController.updateCommentOnTicket);
router.delete('/:ticketId/comments/:id', auth, allRoles, commentController.deleteCommentOnTicket);

module.exports = router;