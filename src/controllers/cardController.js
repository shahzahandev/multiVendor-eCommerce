const Card = require('../models/Card')
const Product = require('../models/product')

exports.addToCard = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body
        const userId = req.user.userId

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not fount'
            })
        }

        if (product.stock < quantity) {
            return res.status(404).json({
                success: false,
                message: 'Insufficient stock'
            })
        }

        let cart = await Card.findOne({
            user: userId
        })

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            })
        }

        const existingItem = card.items.find(item => item.product.toString() === productId)

        if (existingItem) {
            existingItem.quantity == Number(quantity)
        } else {
            card.items.push({
                product: productId,
                quantity: Number(quantity),
                price: product.discountPrice || product.price
            })
        }

        await card.save();

        return res.status(200).json({
            success: true,
            message: 'Product added to card',
            card
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.getCard = async (req, res) => {
    try {
        const card = await Card.findOne({ user: req.user.id }).populate({
            path: itmes.product,
            select: 'title price discountPrice images stock vendor',
            populate: {
                path: 'vandor',
                select: 'shopName'
            }
        })

        if (!card) {
            return res.status(200).json({
                success: true,
                items: [],
                totalAmount: 0
            })
        }
        return res.status(200).json({
            success: true,
            items: card.itmes,
            totalAmount: card.totalAmount,
            totalItems: card.items.length
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.removeFromCard = async (req, res) => {
    try {
        const card = await Card.findOne({ user: userId })

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Card not found'
            })
        }

        cart.items = card.items.filter((item) => {
            item.product.toString() !== productId
        })
        await card.save();

        return res.status(200).json({
            success: true,
            message: 'Item removed from card'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

exports.cleanCard = async (req, res) => {
    try {
        await Card.findOneAndDelete({ user: req.user.id })

        return res.status(200).json({
            success: true,
            message: 'Card cleared'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}