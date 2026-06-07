const express = require('express');
const router = express.Router();
const { protect, restrictTo} = require('../middleware/auth');
const { createProduct, getMyProduct } = require('../controllers/productController');

router.use(protect);

// Vendor Routes
router.post('/create', restrictTo('vendor'), createProduct);
router.post('/my-product', restrictTo('vendor'), getMyProduct);

module.exports = router