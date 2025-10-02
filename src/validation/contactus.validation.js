const { body } = require('express-validator');

const contactUsValidation = [
  // Name validation
  body('userName')
    .trim()
    .exists({ checkFalsy: true }).withMessage('name_is_required')
    .isString().withMessage('name_must_be_string')
    .isLength({ min: 2, max: 100 }).withMessage('name_length_2_100'),

  // Email validation
  body('userEmail')
    .trim()
    .exists({ checkFalsy: true }).withMessage('email_is_required')
    .isEmail().withMessage('email_must_be_valid')
    .normalizeEmail(),

  // Message validation
  body('message')
    .trim()
    .exists({ checkFalsy: true }).withMessage('message_is_required')
    .isString()
    .isLength({ min: 6, max: 2000 }).withMessage('message_length_6_2000')
];

module.exports = contactUsValidation;