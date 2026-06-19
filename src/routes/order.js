const express = require('express')
const router = express.Router()

const {protect, restrictTo} = require('../middleware/auth');
const { createOrder, getMyOrders, getOrderById, getVendorOrders, updateOrderStatus } = require('../controllers/orderController');

router.use(protect);

router.post('/create', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

// Vendor
router.post('/vendor.orders', restrictTo('vendor'), getVendorOrders)
router.post('/vendor/orders/:orderId/status',restrictTo('vendor'), updateOrderStatus)


module.exports = router