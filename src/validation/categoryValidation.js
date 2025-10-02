const { body, param } = require('express-validator');

const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('name_required')
    .isLength({ min: 2, max: 50 }).withMessage('name_length')
];

const updateCategoryValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('invalid_id')
    .toInt(),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('name_required')
    .isLength({ min: 2, max: 50 }).withMessage('name_length')
];


module.exports = {
  createCategoryValidation,
  updateCategoryValidation,

};
