const express = require('express')
const router = express.Router();
const {getAllOrders,updateOrderStatus} = require('../controllers/AdminOrder')

router.route('/').get(getAllOrders);
router.route('/:orderId').post(updateOrderStatus);


module.exports = router;