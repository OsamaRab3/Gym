const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const orderService = require('../../services/orderService');

const createOrder = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400));
  }

  const {
    firstName,
    lastName,
    city,
    address,
    phoneNumber,
    secondPhoneNumber,
    items
  } = req.body;

  const provinceId = req.params.provinceId;

  const order = await orderService.createOrder(
    firstName,
    lastName,
    provinceId,
    city,
    address,
    phoneNumber,
    secondPhoneNumber,
    items
  );

  res.status(201).json({
    success: true,
    message: req.t('order_created'),
    data: order
  });
});

const getOrders = asyncErrorHandler(async (req, res) => {
  const orders = await orderService.getOrders();

  res.status(200).json({
    success: true,
    message: req.t('orders_retrieved'),
    data: orders
  });
});

const getOrderById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const order = await orderService.getOrderById(id);

  res.status(200).json({
    success: true,
    message: req.t('order_retrieved'),
    data: order
  });
});

const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new CustomError(req.t('invalid_order_status'), 400));
  }

  const order = await orderService.updateOrderStatus(id, status);

  res.status(200).json({
    success: true,
    message: req.t('order_status_updated'),
    data: order
  });

});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
