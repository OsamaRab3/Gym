// Coupon service: create, delete, list, get by id, update

const prisma = require('../prisma/prisma')
const CustomError = require('../errors/CustomError')

const VALID_TYPES = ["PERCENT", "FIXED"]

const ensureProductExists = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } })
  if (!product) {
    throw new CustomError('Product not found', 404)
  }
}

const createCoupon = async ({ code, discount, type = 'PERCENT', validFrom, validTo, isActive = true, productId }) => {
  if (!code || typeof discount === 'undefined' || !productId) {
    throw new CustomError('Code, discount and productId are required', 400)
  }

  const discountNum = parseFloat(discount)
  if (Number.isNaN(discountNum) || discountNum <= 0) {
    throw new CustomError('Discount must be a positive number', 400)
  }

  if (!VALID_TYPES.includes(type)) {
    throw new CustomError('Invalid coupon type', 400)
  }

  await ensureProductExists(productId)

  const existing = await prisma.coupon.findUnique({ where: { code } })
  if (existing) {
    throw new CustomError('Coupon code already exists', 409)
  }

  const data = {
    code,
    discount: discountNum,
    type,
    isActive: Boolean(isActive),
    product: { connect: { id: parseInt(productId) } },
  }

  if (validFrom) data.validFrom = new Date(validFrom)
  if (validTo) data.validTo = new Date(validTo)

  if (data.validFrom && data.validTo && data.validFrom > data.validTo) {
    throw new CustomError('validFrom cannot be after validTo', 400)
  }

  const coupon = await prisma.coupon.create({ data, include: { product: true } })
  return coupon
}

const deleteCoupon = async (id) => {
  const existing = await prisma.coupon.findUnique({ where: { id: parseInt(id) } })
  if (!existing) {
    throw new CustomError('Coupon not found', 404)
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
    throw new CustomError('Coupon not found', 404)
  }
  return coupon
}



module.exports = {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,

}
