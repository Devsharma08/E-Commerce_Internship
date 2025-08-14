const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    index:true
  },
  productId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Product',
  },
  userName:String,
  date:{
    type:Date,
    default:Date.now,
    index:true
  },
  rating:{
    type:Number,
    max:[5,'Rating can\'t exceed 5' ],
    min:[1,'Rating can\'t be less than 1'],
  },
  text:String,
})

CommentSchema.index({rating:-1,date:-1});

const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;