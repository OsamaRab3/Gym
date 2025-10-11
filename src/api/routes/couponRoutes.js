
const express = require('express')
const router = express.Router()

const verifyToken = require('../../middleware/verifyToken')
const allowTo = require('../../middleware/allowTo')
const couponController = require('../controllers/couponController')
// const {
//   idParamValidation,
//   productIdParamValidation,
//   createCouponValidation,
//   // useCouponValidation,
//   // listCouponsValidation
// } = require('../../validation/coupon.validation')


router.route('/')
  .get(
    verifyToken,
    allowTo('ADMIN'),
    couponController.getAllCoupons
  )

router.route('/products')
  .post(
    verifyToken,
    allowTo('ADMIN'),
    // productIdParamValidation,
    // createCouponValidation,
    couponController.createCoupon
  )


// Public route for using a coupon
router.post(
  '/use',
  // useCouponValidation,
  couponController.useCoupon
);

router.get('/discounted-products',
  couponController.getDiscountedProducts
)

router.route('/:id')
  .get(
    verifyToken,
    allowTo('ADMIN'),
    // idParamValidation,
    couponController.getCouponById
  )
  .delete(
    verifyToken,
    allowTo('ADMIN'),
    // idParamValidation,
    couponController.deleteCoupon
  )

module.exports = router

