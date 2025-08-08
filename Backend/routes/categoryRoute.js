const express = require('express')
const router = express.Router();
const {CreateCategory, UpdateCategory,deleteCategory, getAllCategory,getSingleCategory} = require('../controllers/CategoryController')

router.route('/').post(CreateCategory).get(getAllCategory);
router.route('/:id').patch(UpdateCategory).delete(deleteCategory).get(getSingleCategory);


module.exports = router;