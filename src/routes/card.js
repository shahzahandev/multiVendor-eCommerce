const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth');
const { addToCard, getCard, removeFromCard, cleanCard } = require('../controllers/cardController');

router.use(protect);
router.post('/add', addToCard)
router.get('/', getCard)
router.delete('/remove/:productId', removeFromCard)
router.delete('/clear', cleanCard)

module.exports = router