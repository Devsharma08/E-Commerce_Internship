const { default: mongoose } = require("mongoose");
const Comment = require('../model/Comment');

const createComment = async(req,res) =>{
  try {
    const {rating,userId,text,userName,productId} = req.body;
    if(!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)){
      return res.status(400).json({msg:"bsd request,userID and productId not valid"});
    }
    const newComment = await Comment.create(req.body);
    if(!newComment){
      return res.status(400).json({msg:"bad request,comment not created"})
    }
    return res.status(200).json(newComment);
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}

const getComment = async(req,res) => {
  try {
    const {productId} = req.params;
    if(!mongoose.isValidObjectId(productId)){
      return res.status(400).json({msg:"bad request,productID not valid"});
    }
    const allComments = await Comment.find({productId}).sort({date:-1,rating:-1}).limit(5);
    if(!allComments){
      return res.status(400).json({msg:"bad request,can\'t get comment"})
    }
    return res.status(200).json(allComments);    

  } catch (error) {
    return res.status(500).json({msg:"some error in server occured"});
  }
}

const deleteComment = async(req,res) => {
  try {
    const {id,userId} = req.params;
    // if(!mongoose.isValidObjectId(id)){
    //   return res.status(400).json({msg:"bsd request,userID not valid"});
    // }
    const deleteComment = await Comment.findOneAndDelete({_id:id,userId});
    if(!deleteComment){
      return res.status(400).json({msg:"bad request, can\'t delete comment"})
    }
    return res.status(200).json({msg:"deleted successfully"});
  } catch (error) {
    return res.status(500).json({msg:error.message});
  }
}

module.exports = {deleteComment,getComment,createComment}