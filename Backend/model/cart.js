const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"
  },
  quantity:Number
},{timestamps:true})

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

module.exports = Cart;