const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name:{
    type:String,
    required:[true,'Enter name'],
    minlength:5,
  },
  email:{
    type:String,
    required:[true,'Enter email'],
    unique:true,
    // match:
  },
  password:{
    type:String,
    required:[true,'Enter password'],
    minlength:5,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
})


module.exports = mongoose.model('User',UserSchema);
