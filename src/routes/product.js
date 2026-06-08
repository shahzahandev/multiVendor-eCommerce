const express = require('express');
const router = express.Router();
const { protect, restrictTo} = require('../middleware/auth');
const { createProduct, getMyProduct, getAllProducts, getProductById } = require('../controllers/productController');

router.use(protect);

// Public
router.get('/', getAllProducts)
router.get('/:id', getProductById)


// Vendor Routes
router.post('/create', restrictTo('vendor'), createProduct);
router.post('/my-product', restrictTo('vendor'), getMyProduct);

module.exports = router