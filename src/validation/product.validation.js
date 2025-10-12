const { body, param, query } = require('express-validator');

const idParamValidation = [
  param('id')
    .exists({ checkFalsy: true }).withMessage('id_required')
    .isString().withMessage('id_must_be_string')
    .isLength({ min: 36, max: 36 }).withMessage('invalid_id_format')
];

const languageQueryValidation = [
  query('lang')
    .optional()
    .isIn(['en', 'ar']).withMessage('invalid_language')
    .toLowerCase()
];


const createProductValidation = [

  body('name')
    .exists({ checkFalsy: true }).withMessage('name_required')
    .isString().withMessage('name_must_be_string')
    .isLength({ min: 2, max: 255 }).withMessage('name_length_2_255')
    .trim(),

  body('description')
    .optional()
    .isString().withMessage('description_must_be_string')
    .isLength({ max: 2000 }).withMessage('description_max_2000')
    .trim(),

  body('price')
    .exists({ checkFalsy: true }).withMessage('price_required')
    .isFloat({ gt: 0 }).withMessage('price_must_be_positive')
    .toFloat(),

  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('weight_must_be_positive')
    .toFloat(),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('discount_must_be_between_0_100')
    .toFloat(),

  body('categoryName')
    .optional()
    .isString().withMessage('category_name_must_be_string')
    .isLength({ min: 2, max: 100 }).withMessage('category_name_length_2_100')
    .trim(),

  body('color')
    .optional()
    .isString().withMessage('color_must_be_string')
    .isLength({ max: 50 }).withMessage('color_max_50')
    .trim(),

  body('manufacturer')
    .optional()
    .isString().withMessage('manufacturer_must_be_string')
    .isLength({ max: 100 }).withMessage('manufacturer_max_100')
    .trim(),

  body('rank')
    .optional()
    .isInt({ min: 0 }).withMessage('rank_must_be_non_negative')
    .toInt(),

  body('images')
    .optional()
    .isArray().withMessage('images_must_be_array')
];

module.exports = {
createProductValidation,
};
