const Order = require('../model/orderSchema');
const mongoose  = require('mongoose')
const Brand = require('../model/brand')

const AddOrder = async (req, res) => {
  try {
    const { quantity, items, address, date, paymentMode, userId } = req.body;

    // Validate required fields
    if (!quantity || !items || !paymentMode || !address || !date || !userId) {
      return res.status(400).json({
        msg: "Missing required fields: quantity, items, paymentMode, address, date, or userId"
      });
    }

    // Validate types
    if (!Array.isArray(items) || typeof quantity !== 'number') {
      return res.status(400).json({
        msg: 'Invalid data format: items must be an array, quantity must be a number'
      });
    }

    // Save order
    const newOrder = await Order.create({
      quantity,
      items,
      address,
      date,
      paymentMode,
      userId
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("AddOrder Error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getCustomerOrder = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ msg: "userId is required" });
    }

    const customerOrder = await Order.find({ userId }).sort({ date: -1 }).populate({path:'items.productId',
      select:' name price discount images'
    });
    // console.log("populated res",customerOrder);

    if (!customerOrder || customerOrder.length === 0) {
      return res.status(404).json({ msg: "No orders found" });
    }

    return res.status(200).json({ customerOrder });

  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { productId, userId } = req.query;

    if (!productId || !userId) {
      return res.status(400).json({ msg: "Both productId and userId are required" });
    }

    const deleted = await Order.deleteOne({ userId, 'items.productId': productId });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ msg: "No matching order item found" });
    }

    return res.status(200).json({ msg: "Product deleted from order" });

  } catch (error) {
    console.error("Delete order error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getBrandByCategory = async(req,res) =>{
  try {
   const {id} = req.params;
   if(!mongoose.isValidObjectId(id)){
    return res.status(200).json({error:"Category Id is not valid"})
   } 
   const brandList = await Brand.find({categoryId:id});
   if(!brandList)
    return res.status(404).json({msg:"No Brand found, try with another id"});
   return res.status(200).json(brandList);
  } catch (error) {
   return res.status(500).json({error:error.message});
  }
}


module.exports = {deleteOrder,getCustomerOrder,AddOrder,getBrandByCategory}