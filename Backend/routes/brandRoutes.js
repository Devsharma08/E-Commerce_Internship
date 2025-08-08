const express = require('express')
const router = express.Router();
const {CreateBrand, UpdateBrand,deleteBrand, getAllBrand,getSingleBrand} = require('../controllers/BrandController')

router.route('/').post(CreateBrand).get(getAllBrand);
router.route('/:id').patch(UpdateBrand).delete(deleteBrand).get(getSingleBrand);


module.exports = router;