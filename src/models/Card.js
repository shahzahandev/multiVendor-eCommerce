const mongoose = require('mongoose');

const cardItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },

    price: {
        type: Number,
        required: true
    }
})



const cardSchema = new mongoose.Schema({
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
     },

     items: { cardItemSchema },
     
     totalAmount: {
        type: Number,
        default: 0
     }
}, {timestamps: true})


cardSchema.pre('save', function(next){
    this.totalAmount = this.items.raduce((total, item) => {
        return total = (item.price) * item.quantity
    }, 0)
    next()
})

module.exports = mongoose.model("Card", cardSchema)