const express = require('express')
const router = express.Router();
const {getCustomerOrder,deleteOrder,AddOrder,getBrandByCategory} = require('../controllers/orderController')

router.route('/:id').get(getBrandByCategory);
router.route('/').get(getCustomerOrder)
router.route('/').delete(deleteOrder)
router.route('/').post(AddOrder);

module.exports = router;