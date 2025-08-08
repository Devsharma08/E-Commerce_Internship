const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name:{
    type:String,
  },
  shortDescription:{
    type:String,
  },
  description:{
    type:String,
  },
  price:{
    type:Number,
  },
  discount:{
    type:Number,
  },
  images:{
    type:Array(String)
  },
  categoryId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
  },
  brandId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Brand',
  },
  isFeaturedProduct:{
    type:Boolean
  },
  isNewProduct:{
    type:Boolean
  }
})




module.exports = mongoose.model('Product',ProductSchema);
