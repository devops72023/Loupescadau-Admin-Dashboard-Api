import mongoose, { model, models } from 'mongoose'
import crypto from 'crypto';
const {ObjectId} = mongoose.Types;


const CartItemSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
    },
    name: String,
    price: Number,
    qty: Number,
    image : String,
}, {
    timestamps: true
});

const CartItem = models.CartItem || model('CartItem' , CartItemSchema);

const orderSchema = new mongoose.Schema({
    products: [CartItemSchema], // array of objects
    transaction_id: {},
    amount: {
        type: Number
    },
    address: String,
    status: {
        type: String,
        default: "Not processed",
        // enum: string objects
        enum: ["Not processed", "Payment is Complete" ,"Shipped", "Delivered", "Cancelled"]
    },
    updated: Date,
    user: {
        type: String,
        ref: "User"
    }
}, {
    timestamps: true
});


export const Order = models.Order || model('Order' , orderSchema);
