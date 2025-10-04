const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../../middleware/verifyToken');
const allowTo = require('../../middleware/allowTo');

const {
  createOrderValidation,
  getOrderByIdValidation,
  updateOrderStatusValidation
} = require('../../validation/order.validation');


router.post(
  '/provinces/:provinceId',
  createOrderValidation,
  orderController.createOrder
);


router.get(
  '/',
  verifyToken,
  allowTo('ADMIN'),
  orderController.getOrders
);


router.get(
  '/:id',
  getOrderByIdValidation,
  orderController.getOrderById
);


router.patch(
  '/:id/status',
  verifyToken,
  allowTo('ADMIN'),
  updateOrderStatusValidation,
  orderController.updateOrderStatus
);

module.exports = router;
