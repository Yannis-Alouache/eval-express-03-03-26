const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/:ticketId', authMiddleware, commentController.getAllCommentsByTicket);
router.post('/:ticketId', authMiddleware, commentController.createCommentOnTicket);
router.put('/:ticketId/:id', authMiddleware, commentController.updateCommentOnTicket);
router.delete('/:ticketId/:id', authMiddleware, commentController.deleteCommentOnTicket);

module.exports = router;