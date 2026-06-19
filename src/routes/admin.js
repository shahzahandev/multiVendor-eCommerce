const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { approveVendor, getPenddingVendors, getAllVendors, getApproveVendors, getRejectedVendors, rejectVendor, getAllUsers, getAdminStats, getPendingProduct, getAllProductsAdmin, approveProduct, rejectProduct } = require('../controllers/adminController');


// All adim routes protected == only admin access
router.use(protect, restrictTo('admin'));


// Vendor managemnet routes
router.get('/vendor/pending', getPenddingVendors);
router.get('/vendor/all', getAllVendors);
router.get('/vendor/approve', getApproveVendors);
router.get('/vendor/rejected', getRejectedVendors)
router.patch('/vendor/:id/approve', approveVendor);
router.patch('/vendor/:id/reject', rejectVendor);


router.get('/stats', getAdminStats)


// Product management routes
router.get('/product/pending', getPendingProduct)
router.get('/product/all', getAllProductsAdmin)
router.patch('/products/:id/approve', approveProduct)
router.patch('/products/:id/reject', rejectProduct)



//Basic user management
router.get('/user/all', getAllUsers);




module.exports = router;