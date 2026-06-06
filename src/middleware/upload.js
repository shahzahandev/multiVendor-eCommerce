const productStorage = new CloudanaryStorage({
    cloudanary,
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
})


const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB per image,
    },
    fileFilter
}).array('image', 8)