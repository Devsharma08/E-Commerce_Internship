const express = require('express');
const router = express.Router();
const {createWishList,deleteWishList,getWishList} = require('../controllers/wishListController')

router.route('/:productId').post(createWishList);
router.route('/').get(getWishList);
router.route('/').delete(deleteWishList);


module.exports = router;