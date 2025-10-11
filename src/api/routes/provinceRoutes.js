const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/provinceController');
const verifyToken = require('../../middleware/verifyToken');
const allowTo = require('../../middleware/allowTo');

const {
  createProvinceValidation,
  updateProvinceValidation,
  provinceIdValidation,
  updateDeliveryFeeValidation,
  removeDeliveryFeeValidation
} = require('../../validation/province.validation');

router.get('/', provinceController.getAllProvinces);
router.get('/:id', provinceController.getProvinceById);


router.post(
  '/',
  verifyToken,
  allowTo('ADMIN'),
  // createProvinceValidation,
  provinceController.createProvince
);

router.put(
  '/:id',
  verifyToken,
  allowTo('ADMIN'),
  // updateProvinceValidation,
  provinceController.updateProvince
);

router.delete(
  '/:id',
  verifyToken,
  allowTo('ADMIN'),
  // provinceIdValidation,
  provinceController.deleteProvince
);


router.post(
  '/:provinceId/products/:productId/delivery-fee',
  verifyToken,
  allowTo('ADMIN'),
  // updateDeliveryFeeValidation,
  provinceController.updateDeliveryFee
);

router.delete(
  '/:provinceId/products/:productId/delivery-fee',
  verifyToken,
  allowTo('ADMIN'),
  // removeDeliveryFeeValidation,
  provinceController.removeDeliveryFee
);

module.exports = router;
