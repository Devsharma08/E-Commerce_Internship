const express = require('express')
const router = express.Router();
const {registerUser,loginUser,getAllUser} = require('../controllers/AuthController')
// const authentication = require('../middleware/authentication')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/').get(getAllUser);

module.exports = router;