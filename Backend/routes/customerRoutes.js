const express = require('express')
const router = express.Router();
const {getFeaturedProducts,getNewProducts} = require('../controllers/ProductController')
const {getCategoryName,getListedProduct} = require('../controllers/ProductController')
const {getSameCategoryProduct} = require('../controllers/ProductController')



router.route('/featured').get(getFeaturedProducts);
router.route('/new').get(getNewProducts);
router.route('/product').get(getListedProduct);
router.route('/related/:categoryId').get(getSameCategoryProduct);
router.route('/').get(getCategoryName);

module.exports = router;