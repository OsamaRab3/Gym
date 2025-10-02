const { body, param } = require('express-validator')

// Common validators
const idParamValidation = [
  param('id')
    .exists({ checkFalsy: true }).withMessage('id_is_required')
    .isInt({ gt: 0 }).withMessage('id_must_be_positive_integer')
]

const createProductValidation = [
  body('name')
    .exists({ checkFalsy: true }).withMessage('name_is_required')
    .isString().withMessage('name_must_be_string')
    .isLength({ min: 2, max: 100 }).withMessage('name_length_2_100'),
  body('price')
    .exists().withMessage('price_is_required')
    .isFloat({ gt: 0 }).withMessage('price_must_be_positive_number'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('description_must_be_string')
    .isLength({ max: 2000 }).withMessage('description_max_2000'),
  body('stock')
    .exists().withMessage('stock_is_required')
    .isInt({ min: 0 }).withMessage('stock_must_be_non_negative_integer'),
  body('discount')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 }).withMessage('discount_must_be_between_0_100'),
  body('color')
    .optional({ nullable: true })
    .isString().withMessage('color_must_be_string')
    .isLength({ max: 50 }).withMessage('color_max_50'),
  body('manufacturer')
    .optional({ nullable: true })
    .isString().withMessage('manufacturer_must_be_string')
    .isLength({ max: 100 }).withMessage('manufacturer_max_100'),
  body('categoryName')
    .optional({ nullable: true })
    .isString().withMessage('category_name_must_be_string')
    .isLength({ min: 2, max: 100 }).withMessage('category_name_length_2_100'),
  body('imageUrl')
    .optional({ nullable: true })
    .isURL().withMessage('image_url_must_be_valid_url')
]

const updatableFields = [
  'name', 'description', 'price', 'stock', 'discount',
  'color', 'manufacturer', 'categoryName', 'imageUrl'
]

const updateProductValidation = [
  ...idParamValidation,
  // Ensure at least one valid field is provided
  body().custom((value, { req }) => {
    const keys = Object.keys(req.body || {})
    const hasAllowedField = keys.some(k => updatableFields.includes(k))
    if (!hasAllowedField) {
      throw new Error('no_valid_fields_to_update')
    }
    return true
  }),
  body('name')
    .optional()
    .isString().withMessage('name_must_be_string')
    .isLength({ min: 2, max: 100 }).withMessage('name_length_2_100'),
  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('price_must_be_positive_number'),
  body('description')
    .optional({ nullable: true })
    .isString().withMessage('description_must_be_string')
    .isLength({ max: 2000 }).withMessage('description_max_2000'),
  body('stock')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('stock_must_be_non_negative_integer'),
  body('discount')
    .optional({ nullable: true })
    .isFloat({ min: 0, max: 100 }).withMessage('discount_must_be_between_0_100'),
  body('color')
    .optional({ nullable: true })
    .isString().withMessage('color_must_be_string')
    .isLength({ max: 50 }).withMessage('color_max_50'),
  body('manufacturer')
    .optional({ nullable: true })
    .isString().withMessage('manufacturer_must_be_string')
    .isLength({ max: 100 }).withMessage('manufacturer_max_100'),
  body('categoryName')
    .optional({ nullable: true })
    .isString().withMessage('category_name_must_be_string')
    .isLength({ min: 2, max: 100 }).withMessage('category_name_length_2_100'),
  body('imageUrl')
    .optional({ nullable: true })
    .isURL().withMessage('image_url_must_be_valid_url')
]

const updateProductRankValidation = [
  ...idParamValidation,
  body('rank')
    .exists().withMessage('rank_is_required')
    .isInt({ min: 0 }).withMessage('rank_must_be_non_negative_integer')
]

module.exports = {
  idParamValidation,
  createProductValidation,
  updateProductValidation,
  updateProductRankValidation,
}
