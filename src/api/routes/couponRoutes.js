
const express = require('express')
const router = express.Router()

const verifyToken = require('../../middleware/verifyToken')
const allowTo = require('../../middleware/allowTo')
const couponController = require('../controllers/couponController')

router.route('/')
  .get(verifyToken,allowTo('ADMIN'),couponController.getAllCoupons)
  .post(verifyToken, allowTo('ADMIN'), couponController.createCoupon)

router.route('/:id')
  .get(verifyToken,allowTo('ADMIN'),couponController.getCouponById)
  .delete(verifyToken, allowTo('ADMIN'), couponController.deleteCoupon)

module.exports = router

