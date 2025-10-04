const { body, param } = require('express-validator');

exports.createProvinceValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('name_required')
    .isLength({ min: 2, max: 100 }).withMessage('name_length')
];

exports.updateProvinceValidation = [
  param('id')
    .isInt().withMessage('invalid_province_id')
    .toInt(),
  body('name')
    .trim()
    .notEmpty().withMessage('name_required')
    .isLength({ min: 2, max: 100 }).withMessage('name_length')
];

exports.provinceIdValidation = [
  param('id')
    .isInt().withMessage('invalid_province_id')
    .toInt()
];

exports.updateDeliveryFeeValidation = [
  param('provinceId')
    .isInt().withMessage('invalid_province_id')
    .toInt(),
  param('productId')
    .isInt().withMessage('invalid_product_id')
    .toInt(),
  body('fee')
    .isFloat({ min: 0 }).withMessage('invalid_fee_amount')
    .toFloat()
];

exports.removeDeliveryFeeValidation = [
  param('provinceId')
    .isInt().withMessage('invalid_province_id')
    .toInt(),
  param('productId')
    .isInt().withMessage('invalid_product_id')
    .toInt()
];
