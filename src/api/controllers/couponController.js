
const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler')
const CustomError = require('../../errors/CustomError')
const status = require('../../utils/status')
const couponServices = require('../../services/couponServices')

const createCoupon = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
  }

  const { code, discount, type = 'PERCENT', validFrom, validTo, isActive = false } = req.body

  const coupon = await couponServices.createCoupon({
    code,
    discount,
    type,
    validFrom,
    validTo,
    isActive,
  })
  
  res.status(201).json({
    message: req.t('coupon_created'),
    status: status.SUCCESS,
    data: coupon,
  })
})

const deleteCoupon = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
  }

  const id = req.params.id
  const result = await couponServices.deleteCoupon(id)

  res.status(200).json({
    message: req.t('coupon_deleted'),
    status: status.SUCCESS,
    data: result,
  })
})

const useCoupon = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400));
  }

  const { code } = req.body;
  const deviceId = req.ip; 
  const lang = req.query.lang || "AR";
  

  const result = await couponServices.useCoupon(lang,code, deviceId);

  res.status(200).json({
    message: req.t('coupon_applied_successfully'),
    status: status.SUCCESS,
    data: result,
  });
});

const getAllCoupons = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
  }

  const coupons = await couponServices.getAllCoupons();

  res.status(200).json({
    message: req.t('coupons_retrieved'),
    status: status.SUCCESS,
    data: {
      coupons

    }
  })
})

const getDiscountedProducts = asyncErrorHandler(async (req, res, next) => {
  const deviceId = req.ip; 
  const lang = req.query.lang || "AR";

  const products = await couponServices.getDiscountedProducts(lang,deviceId);

  res.status(200).json({
    message: products.length > 0 ? req.t('discounted_products_retrieved') : req.t('no_active_discounts'),
    status: status.SUCCESS,
    data: products,
  });
});

const getCouponById = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
  }

  const id = req.params.id
  const coupon = await couponServices.getCouponById(id)

  res.status(200).json({
    message: req.t('coupon_retrieved'),
    status: status.SUCCESS,
    data: coupon,
  })
})
module.exports = {
  createCoupon,
  deleteCoupon,
  useCoupon,
  getAllCoupons,
  getCouponById,
  getDiscountedProducts
};
