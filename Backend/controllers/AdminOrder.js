const Order = require('../model/orderSchema')
const mongoose = require('mongoose');

const getAllOrders = async(req,res) =>{
  try{
    const allProducts = await Order.find({}).populate({
      path:'items.productId',
    });
    return res.status(200).json(allProducts);

  } catch(error){
    return res.status(500).json({msg:"server error"});
  }
}


const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    if (!status) {
      return res.status(400).json({ msg: "Status is required." });
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ msg: "Invalid orderId." });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id:orderId
      },
      {
        $set: { 'status': status },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found." });
    }

    return res.status(200).json({
      msg: "Updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ msg: "Server error occurred" });
  }
};


module.exports = {getAllOrders,updateOrderStatus}