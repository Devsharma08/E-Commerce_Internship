const express = require('express')
const router = express.Router();
const {getCustomerOrder,deleteOrder,AddOrder} = require('../controllers/orderController')

router.route('/').get(getCustomerOrder)
router.route('/').delete(deleteOrder)
router.route('/').post(AddOrder);

module.exports = router;