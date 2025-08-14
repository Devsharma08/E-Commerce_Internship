const express = require('express');
const { createComment, getComment, deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.post('/', createComment);

router.get('/:productId', getComment);

router.delete('/:id/:userId', deleteComment);

module.exports = router;
