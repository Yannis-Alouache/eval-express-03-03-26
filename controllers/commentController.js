const { Ticket, Comment } = require('../models');

exports.getAllCommentsByTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const comments = await Comment.findAll({ where: { ticket_id: ticket.id } });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCommentOnTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const newComment = await Comment.create({
            content: req.body.content,
            is_internal: req.body.is_internal ?? false,
            ticket_id: ticket.id,
            author_id: req.user.id
        });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCommentOnTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const comment = await Comment.findOne({ where: { id: req.params.id, ticket_id: ticket.id } });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author_id !== req.user.id) return res.status(403).json({ message: 'Vous n\'êtes pas l\'auteur de ce commentaire' });

        if (req.body.content !== undefined) comment.content = req.body.content;
        if (req.body.is_internal !== undefined) comment.is_internal = req.body.is_internal;
        const updated = await comment.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCommentOnTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByPk(req.params.ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const comment = await Comment.findOne({ where: { id: req.params.id, ticket_id: ticket.id } });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author_id !== req.user.id) return res.status(403).json({ message: 'Vous n\'êtes pas l\'auteur de ce commentaire' });

        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
