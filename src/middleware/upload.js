const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

// Product upload
const productStorage = new CloudinaryStorage({
    cloudinary,
    params: (res, file) => ({
        folder: 'products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `product-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        transformation: [{
            width: 800,
            height: 800,
            crop: 'limit',
            quality: 'auto'
        }]
    })
});

// Multiple product uploaded
const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB per image,
    },
    fileFilter
}).array('image', 8)

// Vendor logo uplaod
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: (res, file) => ({
        folder: 'vendors/logo',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `logo-${req.body.email || 'unknown'}-${Date.now()}`,
        transformation: [{
            width: 500,
            height: 500,
            crop: 'limit',
            quality: 'auto'
        }]
    })
})

// NID Document uplaod
const nidStorage = new CloudinaryStorage({
    cloudinary,
    params: (res, file) => ({
        folder: 'vendors/nids',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        public_id: `nid-${req.body.nidName || 'unknown'}-${Date.now()}`,
        transformation: [{
            quality: 'auto'
        }]
    })
})

// file filter for extra security
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(file.orginalname.toLowerCase());l
    const minetype = allowedTypes.test(file.minetype);

    if(extname && minetype){
        return cb(null, true)
    }    
    cb(new Error('Only images (jpe, jpeg, png, webp) and PDF allowed'))
}

// Logo uploader for single file
const uplaodLogo = multer({
    storage: logoStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5mb
    },
    fileFilter
}).single('shopLogo')


// NID uploader for single file
const uplaodNid = multer({
    storage: nidStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5mb
    },
    fileFilter
}).single('nidScan')


module.exports = {uplaodLogo, uplaodNid, uploadProductImages}