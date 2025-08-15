const WishList = require("../model/wishList")
const User = require('../model/userSchema')
const mongoose = require('mongoose')


const createWishList = async (req, res) => {
  try {
    const { userId } = req.body;
    const {productId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)){
      return res.status(402).json({msg:"Wrong userId,productId"})
    }

    if (!userId || !productId) {
      return res.status(400).json({ msg: "Please provide both userId and productId." });
    }
    const existingItem = await WishList.findOne({ userId, productId });
    const user = await User.findOne({_id:userId})
    if (existingItem) {
      return res.status(200).json({ msg: "Item already exists in wishlist.", item: existingItem });
    }
    if(!user)
      return res.status(404).json({msg:"userID not found,please rectify this"});

    const newItem = await WishList.create({ userId, productId });

    return res.status(201).json({ msg: "Wishlist item created successfully.", item: newItem });

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}


const deleteWishList = async(req,res) =>{
  try {
  const {userId,productId} = req.query;

  if(!userId || !productId){
    return res.status(401).json({msg:"enter the userId and productId"});
  }

  const wishListItem = await WishList.findOneAndDelete({userId,productId});

  if(!wishListItem){
    return res.status(404).status({msg:"Item do not found"});
  }
  return res.status(200).json({msg:"Deleted wishlist data successfully"});

  } catch (error) {
    res.status(500).json({msg:error.message});
  }
}


const getWishList = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    const wishlist = await WishList.find({ userId }).populate('productId');

    return res.status(200).json(wishlist);

  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { deleteWishList , createWishList ,getWishList}