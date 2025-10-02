const express = require('express');
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../../middleware/verifyToken')
const allowTo = require('../../middleware/allowTo')
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require('../../validation/categoryValidation');

const router = express.Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get(
  '/:id',
  categoryController.getCategoryById
);

router.post(
  '/',
  verifyToken,
  allowTo('ADMIN'),
  createCategoryValidation,
  categoryController.createCategory
);

router.put(
  '/:id',
  verifyToken,
  allowTo('ADMIN'),
  updateCategoryValidation,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  verifyToken,
  allowTo('ADMIN'),
  categoryController.deleteCategory
);

module.exports = router;
