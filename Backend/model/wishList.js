const mongoose = require('mongoose');

const WishListSchema = mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"  
  },
})

const WishList = mongoose.models.WishList || mongoose.model('WishList', WishListSchema);


module.exports = WishList