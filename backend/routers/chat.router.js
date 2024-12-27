const { selectUser, postChats, getMessages, postReaction, deleteChat } = require('../controllers/chat.controller');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = require('express').Router();

router.post('/', isAuthenticated, postChats);
router.get('/:selectedUserId', isAuthenticated, getMessages);
router.post('/react', isAuthenticated, postReaction)
router.delete('/:id', isAuthenticated, deleteChat)


module.exports = router