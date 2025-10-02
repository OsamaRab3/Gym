const { body, param, query } = require('express-validator')


const idParamValidation = [
  param('id')
    .exists({ checkFalsy: true }).withMessage('id_is_required')
    .isInt({ gt: 0 }).withMessage('id_must_be_positive_integer')
]

const productIdParamValidation = [
  param('productId')
    .exists({ checkFalsy: true }).withMessage('coupon_product_required')
    .isInt({ gt: 0 }).withMessage('id_must_be_positive_integer')
]


const createCouponValidation = [
  ...productIdParamValidation,
  body('code')
    .exists({ checkFalsy: true }).withMessage('coupon_code_required')
    .isString().withMessage('code_must_be_string')
    .isLength({ min: 4, max: 20 }).withMessage('code_length_4_20')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('code_invalid_format'),
  
  body('discount')
    .exists({ checkFalsy: true }).withMessage('coupon_discount_required')
    .isFloat({ gt: 0 }).withMessage('coupon_discount_positive'),
    
  body('type')
    .optional()
    .isIn(['PERCENT', 'FIXED']).withMessage('coupon_invalid_type'),
    
  body('validFrom')
    .optional()
    .isISO8601().withMessage('invalid_date_format')
    .toDate(),
    
  body('validTo')
    .exists({ checkFalsy: true }).withMessage('coupon_valid_to_required')
    .isISO8601().withMessage('invalid_date_format')
    .toDate()
    .custom((value, { req }) => {
      if (req.body.validFrom && new Date(value) <= new Date(req.body.validFrom)) {
        throw new Error('coupon_invalid_dates')
      }
      return true
    }),
    
  body('isActive')
    .optional()
    .isBoolean().withMessage('must_be_boolean')
]



// const listCouponsValidation = [
//   query('page')
//     .optional()
//     .isInt({ min: 1 }).withMessage('page_must_be_positive_integer')
//     .toInt(),
    
//   query('limit')
//     .optional()
//     .isInt({ min: 1, max: 100 }).withMessage('limit_must_be_between_1_and_100')
//     .toInt(),
    
//   query('isActive')
//     .optional()
//     .isBoolean().withMessage('must_be_boolean')
//     .toBoolean(),
    
//   query('type')
//     .optional()
//     .isIn(['PERCENT', 'FIXED']).withMessage('coupon_invalid_type')
// ]

module.exports = {
  idParamValidation,
  productIdParamValidation,
  createCouponValidation,
  // listCouponsValidation
}
