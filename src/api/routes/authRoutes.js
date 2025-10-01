const express = require('express')
const authController = require("../controllers/authController")
const router = express.Router()


// Route definitions

router.route('/login')
.post(authController.login)






module.exports = router;