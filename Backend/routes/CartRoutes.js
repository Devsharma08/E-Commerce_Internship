const express = require('express')
const router = express.Router();
const { getAllCart,AddToCart,DeleteCart,clearCart } = require('../controllers/CartController')

router.route('/:userId').get(getAllCart);
router.route('/:productId/:quantity').post(AddToCart);
router.route('/:userId').delete(clearCart);
router.route('/:productId/:userId').delete(DeleteCart);

module.exports = router;