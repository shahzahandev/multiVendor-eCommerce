const express = require('express')
const router = express.Router()

const {protect} = require('../middleware/auth');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');

router.use(protect);

router.post('/create', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);


module.exports = router