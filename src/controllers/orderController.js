const Order = require('../models/Order')
const Card = require('../models/Card')
const Product = require('../models/product')


exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod = 'cod' } = req.body
        const userId = req.user.userId
        const card = await Card.findOne({ user: userId }).populate('itmes.product')


        if (!card || card.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Card is empty'
            })
        }

        const orderItems = []
        const vendor = new Map()

        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insuffiencient stock for ${product.item}`
            })
        }

        orderItems.push({
            product: product._id,
            title: product.title,
            quantity: item.quantity,
            price: product.discountPrice || product.price,
            vendor: product.vendor
        })

        if (!vendorMap.has(product.vendor.toString())) {
            vendorMap.set(product.vendor.toString(), {
                vendor: product.vendor,
                status: 'pending'
            })
        }

        product.stock -= item.quantity
        await product.save()


        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity)
        }, 0)

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentStatus == 'cod' ? 'pending' : 'paid',
            vendorStatuses: Array.from(vendorMap.values())
        })

        await order.save()

        await Card.findOneAndDelete({ user: userId });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('itmes.product', 'title images')


        return res.status(200).json({
            success: false,
            count: orders.length,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('items.product')

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        return res.status(200).json({
            success: true,
            order
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}


// Vendor Order Manage
exports.getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const order = await Order.find({
            'itmes.vendor': vendorId
        })
            .populate('user', 'name email phone')
            .populate('items.product', 'title images')
            .sort({ createdAt: -1 })

        const formattedOrders = order.map(order => {
            const vendorItems = order.items.filter(item.vendor.toString() === vendorId);

            const vendorTotal = vendorItems.reduce((sum, item) => {
                return sum + (item.price * item.quantity)
            }, 0)

            return {
                _id: order._id,
                orderId: order.orderId,
                customer: order.user,
                items: vendorItems,
                totalAmount: vendorTotal,
                orderStatus: order.paymentStatus,
                shippingAddress: order.shippingAddress,
                createdAt: order.createdAt
            }
        })

        res.status(200).json({
            success: true,
            count: formattedOrders.length,
            order: formattedOrders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const vendorId = req.user.id

        const order = await Order.findByIdAndUpdate({ orderId })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        const hasItem = order.items.some(item => item.vendor.toString() === vendorId)

        if (!hasItem) {
            return res.status(404).json({
                success: false,
                message: 'Not authrized for this order'
            })
        }


        const vendorStatus = order.vendorStatuses.find(vs => vs.vendor.toString() === vendorId)

        if (vendorStatus) {
            vendorStatus.status = status
        }

        const allVendorStatuses = vendorStatus.map(vs => vs.status)

        if (allVendorStatuses.every(s => s === 'delivered')) {
            order.orderStatus = 'delivered'
        } else if (allVendorStatuses.some(s => s === 'shipped')) {
            order.orderStatus = 'shipped'
        } else if (allVendorStatuses.some(s => s === 'processing')) {
            order.orderStatus = 'processing'
        }

        await order.save()

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}
