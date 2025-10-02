const prisma = require('../prisma/prisma')
const CustomError = require('../errors/CustomError')

const VALID_TYPES = ["PERCENT", "FIXED"]

const ensureProductExists = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } })
  if (!product) {
    throw new CustomError('coupon_product_not_found', 404)
  }
}

const createCoupon = async ({ code, discount, type = 'PERCENT', validFrom, validTo, isActive = true, productId }) => {

  await ensureProductExists(productId)

  const existing = await prisma.coupon.findUnique({ where: { code } })
  if (existing) {
    throw new CustomError('coupon_code_exists', 409)
  }

  const now = new Date()
  const startDate = validFrom ? new Date(validFrom) : now
  const endDate = new Date(validTo)

  if (startDate > endDate) {
    throw new CustomError('coupon_invalid_dates', 400)
  }
  const data = {
    code,
    discount,
    type,
    isActive: Boolean(isActive),
    validFrom: startDate,
    validTo: endDate,
    product: { connect: { id: parseInt(productId) } },
  }

  const coupon = await prisma.coupon.create({ data, include: { product: true } })
  return coupon
}

const deleteCoupon = async (id) => {
  const existing = await prisma.coupon.findUnique({ where: { id: parseInt(id) } })
  if (!existing) {
    throw new CustomError('coupon_not_found', 404)
  }
  await prisma.coupon.delete({ where: { id: parseInt(id) } })
  return { id: parseInt(id) }
}

const getAllCoupons = async () => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: true },
  })
  return coupons
}

const getCouponById = async (id) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id: parseInt(id) },
    include: { product: true },
  })
  if (!coupon) {
    throw new CustomError('coupon_not_found', 404)
  }
  return coupon
}



module.exports = {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,

}
