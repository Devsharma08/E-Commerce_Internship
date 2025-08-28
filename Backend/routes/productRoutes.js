const {CreateProduct,UpdateProduct,generateDescription, deleteProduct,getAllProduct,getSingleProduct} = require('../controllers/ProductController');

const express = require('express');
const router = express.Router();


router.route('/').post(CreateProduct).get(getAllProduct);
router.route('/generateAI-Description').post(generateDescription);
router.route('/:id').patch(UpdateProduct).delete(deleteProduct).get(getSingleProduct);



module.exports = router;