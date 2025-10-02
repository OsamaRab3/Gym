const express = require('express')
const authController = require("../controllers/authController")
const router = express.Router()
const { loginValidation } = require('../../validation/login.validation')


// Route definitions

router.route('/login')
.post(loginValidation, authController.login)





module.exports = router;