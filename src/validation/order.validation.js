const { body, param } = require('express-validator');

exports.createOrderValidation = [
  param('provinceId')
    .isInt().withMessage('province_id_must_be_integer')
    .toInt(),
  body('firstName')
    .trim()
    .notEmpty().withMessage('first_name_required')
    .isLength({ min: 2, max: 50 }).withMessage('first_name_length'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('last_name_required')
    .isLength({ min: 2, max: 50 }).withMessage('last_name_length'),
  body('city')
    .trim()
    .notEmpty().withMessage('city_required')
    .isLength({ min: 2, max: 100 }).withMessage('city_length'),
  body('address')
    .trim()
    .notEmpty().withMessage('address_required')
    .isLength({ min: 5, max: 255 }).withMessage('address_length'),
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('phone_required')
    .matches(/^\+?[0-9\s-]{10,20}$/).withMessage('invalid_phone_format'),
  body('secondPhoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[0-9\s-]{10,20}$/).withMessage('invalid_phone_format'),
  body('items')
    .isArray({ min: 1 }).withMessage('at_least_one_item_required')
    .custom((items) => {
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity < 1) {
          throw new Error('invalid_items_format');
        }
      }
      return true;
    })
];

exports.getOrderByIdValidation = [
  param('id')
    .isInt().withMessage('invalid_order_id')
    .toInt()
];

exports.updateOrderStatusValidation = [
  param('id')
    .isInt().withMessage('invalid_order_id')
    .toInt(),
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('invalid_order_status')
];
