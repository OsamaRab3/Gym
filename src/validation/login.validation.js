const { body } = require('express-validator')

// Validation chain for login
const loginValidation = [
  body('email')
    .exists({ checkFalsy: true }).withMessage('email_is_required')
    .isEmail().withMessage('email_must_be_valid'),
  body('password')
    .exists({ checkFalsy: true }).withMessage('password_is_required')
    .isString().withMessage('password_must_be_string')
    .isLength({ min: 6 }).withMessage('password_min_length_6')
]

module.exports = {
  loginValidation,
}

