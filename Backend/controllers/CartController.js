const Cart = require('../model/cart');


const AddToCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId,quantity } = req.params;

    let userCart = await Cart.findOne({ productId, userId });

    if (userCart) {

      userCart.quantity = quantity;
      await userCart.save();
      return res.status(200).json({ msg: 'Cart updated', cart: userCart });
    } else {

      const newCartItem = await Cart.create({ productId, userId, quantity });
      return res.status(201).json({ msg: 'Product added to cart', cart: newCartItem });
    }
  } catch (error) {
    // console.error("AddToCart Error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const DeleteCart = async (req, res) => {
  try {
    const { productId,userId } = req.params;

    const deletedCart = await Cart.findOneAndDelete({ productId, userId });

    if (deletedCart) {
      return res.status(200).json({ msg: 'Cart item removed successfully' });
    } else {
      return res.status(404).json({ msg: 'Cart item not found' });
    }
  } catch (error) {
    console.error("DeleteCart Error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getAllCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const allCarts = await Cart.find({ userId }).populate('productId');
    if (!allCarts || allCarts.length === 0) {
      return res.status(200).json({ msg: "No products found", items: [] });
    }
    return res.status(200).json( allCarts );}
    
    catch (error) {
    console.error("getAllCart Error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const clearCart = async(req,res) =>{
  const {userId} = req.params;
  const clearedData = await Cart.deleteMany(userId);
  return res.status(200).json({msg:"whole cart cleared"})
}

module.exports = { getAllCart, AddToCart, DeleteCart,clearCart };
