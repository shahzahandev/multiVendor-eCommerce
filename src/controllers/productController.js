const Product = require('../models/product');
const { createProductSchema } = require('../validation/product.validation');
const validate = require('../middleware/validate');
const { uploadProductImages } = require('../middleware/upload')

// Create product
exports.createProduct = [
    uploadProductImages,
    validate(createProductSchema),
    async (req, res) => {
        try {
            const vendorId = req.user.id;
            const images = req.files ? req.files.map(file => ({
                url: file.path,
                publicId: file.filename
            })) : []

            if (images.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one image is required'
                });
            }

            if (images.length > 0) images[0].isMain = true;

            const product = new Product({
                ...req.body,
                vendor: vendorId,
                images,
                slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            })

            await product.save()

            return res.status(200).json({
                success: true,
                message: 'Product created successfully, Waiting for admin approval',
                product
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    }
]

// Get all product
exports.getMyProduct = async (req, res) => {
    try {
        const product = await Product.find({
            vendor: req.user.id,
        }).sort({ createAt: -1 });

        return res.status(200).json({
            success: true,
            count: product.length,
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}