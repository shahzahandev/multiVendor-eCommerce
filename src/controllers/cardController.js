const Card = require('../models/Card')
const Product = require('../models/product')

exports.addToCard = async( req, res) => {
    try {
        const {productId, quantity =1} = req.body
        const userId = req.user.userId

        const product = await Product.findById(productId)

        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not fount'
            })
        }

        if(product.stock < quantity){
            return res.status(404).json({
                success: false,
                message: 'Insufficient stock'
            })
        }

        let cart = await Card.findOne(P{
            user: userId
        })

        if(!cart){
            cart = new Cart({
                user: userId,
                items: []
            })
        }
        
        const existingItem = card.items.find(item => item.product.toString() === productId)

        if(existingItem){
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