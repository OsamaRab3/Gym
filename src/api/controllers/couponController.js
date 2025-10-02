
const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler')
const CustomError = require('../../errors/CustomError')
const status = require('../../utils/status')
const couponServices = require('../../services/couponServices')

const createCoupon = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new CustomError(req.t('validation_error_with_detail', errors.array()[0].msg), 400))
  }

  const { code, discount, type, validFrom, validTo, isActive, productId } = req.body
  const coupon = await couponServices.createCoupon({ code, discount, type, validFrom, validTo, isActive, productId })

  res.status(201).json({
    message: req.t('coupon_created'),
    status: status.SUCCESS,
    data: coupon,
  })
})

const deleteCoupon = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id
  const result = await couponServices.deleteCoupon(id)
  res.status(200).json({
    message: req.t('coupon_deleted'),
    status: status.SUCCESS,
    data: result,
  })
})

const getAllCoupons = asyncErrorHandler(async (req, res) => {
  const coupons = await couponServices.getAllCoupons()
  res.status(200).json({
    message: req.t('coupons_retrieved'),
    status: status.SUCCESS,
    data: coupons,
  })
})

const getCouponById = asyncErrorHandler(async (req, res, next) => {
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
  getAllCoupons,
  getCouponById,

}

