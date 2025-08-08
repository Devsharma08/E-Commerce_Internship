const mongoose = require('mongoose');


const OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status:{
    type:String,
    enum:['pending','delievered','shipped','cancel'],
    default:'pending',
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true }
    }
  ],
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMode: { type: String, required: true },
  date: { type: Date, default: Date.now }
})


const Order = mongoose.models.OrderSchema || mongoose.model('Order',OrderSchema);
module.exports = Order;