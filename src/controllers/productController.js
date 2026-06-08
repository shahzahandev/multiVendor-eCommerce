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


// Get all approved products with filter, search & pagination
exports.getAllProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            sort = 'newest',
            page = 1,
            limit = 20
        } = req.query

        const query = { status: 'approved' }

        if (search) {
            query.$text = { $search: search }
        }

        if (category) {
            query.category = category
        }

        if (brand) {
            query.brand = brand
        }

        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = Number(minPrice)
            if (maxPrice) query.price.$gte = Number(maxPrice)
        }

        // sortin
        let sortOption = {};
        switch (sort) {
            case 'price-low':
                sortOption = { price: 1 };
            case 'price-higt':
                sortOption = { price: -1 };
            case 'popular':
                sortOption = { sold: -1 };
            case 'newest':
            default:
                sortOption = { createAt: -1 }
        }

        const skip = (page - 1) * limit
        cosnt[products, total] = await Promise.all([
            Product.find(query)
                .select('title price discountPrice images category brand slug stock')
                .populate('vendor', 'shopName shopLogo')
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit)),

            Product.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            count: products.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(Page),
            products
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// Get product by Vendor
exports.getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate('vendor', 'shopName shopLogo name')
        
        if(!product || product.status !== 'apporved'){
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        return res.status(200).json({
            success: true,
            product
        })
        
    } catch (error) {
            return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}