const express = require('express');
const router = express.Router();
const contactUsValidation = require('../../validation/contactus.validation');
const { submitContactForm } = require('../controllers/contactusController');


router.post('/', contactUsValidation, submitContactForm);

module.exports = router;