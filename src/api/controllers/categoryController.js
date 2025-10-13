const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const categoryService = require('../../services/categoryService');

const getCategories = asyncErrorHandler(async (req, res) => {

  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    success: true,
    message: req.t('categories_retrieved'),
    data: categories
  });

});

const createCategory = asyncErrorHandler(async (req, res,next) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
  }

  const { name } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);
  const category = await categoryService.createCategory(name,images[0]);

  res.status(201).json({
    success: true,
    message: req.t('category_created'),
    data: category
  });


});

const updateCategory = asyncErrorHandler(async (req, res,next) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
  }

  const { id } = req.params;
  const { name } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);

  const updatedCategory = await categoryService.updateCategory(id, name,images[0]);

  res.status(200).json({
    success: true,
    message: req.t('category_updated'),
    data: updatedCategory
  });

});

const deleteCategory = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  await categoryService.deleteCategory(id);

  res.json({
    success: true,
    message: req.t('category_deleted'),
  });

});

const getCategoryById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(id);

  res.json({
    success: true,
    message: req.t('category_retrieved'),
    data: category
  });

});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
