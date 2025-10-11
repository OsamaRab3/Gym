const prisma = require('../prisma/prisma')
const CustomError = require('../errors/CustomError')

const VALID_TYPES = ["PERCENT", "FIXED"]
const normalizeLanguage = (lang) => {
  if (!lang) return 'AR';
  const upper = String(lang).toUpperCase();
  return upper === 'EN' ? 'EN' : 'AR';
};
const ensureProductExists = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } })
  if (!product) {
    throw new CustomError('coupon_product_not_found', 404)
  }
}

const createCoupon = async ({ code, discount, type = 'PERCENT', validFrom, validTo, isActive = false }) => {

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
    isActive: Boolean(true),
    validFrom: startDate,
    validTo: endDate,
  }

  const coupon = await prisma.coupon.create({ data })
  return coupon
}

const deleteCoupon = async (id) => {
  const existing = await prisma.coupon.findUnique({ where: { id } })
  if (!existing) {
    throw new CustomError('coupon_not_found', 404)
  }
  await prisma.coupon.delete({ where: { id } })
  return { id }
}

const getAllCoupons = async () => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return coupons
}

const getCouponById = async (id) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id },
  })
  if (!coupon) {
    throw new CustomError('coupon_not_found', 404)
  }
  return coupon
}


const applyDiscountToProduct = (lang,product, coupon) => {
  const originalPrice = parseFloat(product.price);
  let discountAmount = 0;

  if (coupon.type === 'PERCENT') {
    discountAmount = (originalPrice * coupon.discount) / 100;
  } else {
    discountAmount = Math.min(coupon.discount, originalPrice);
  }

  return {
    originalPrice,
    discountPrice: parseFloat(Math.max(0, originalPrice - discountAmount).toFixed(2))
  };
};

const applyCouponToProducts = async (lang, coupon, deviceId) => {
  const expiresAt = coupon.validTo;

  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    include: {
      translations: {
        where: {
          language: normalizeLanguage(lang)
        }
      },
      images: true,
      category: true
    }
  });

  const couponData = await prisma.coupon.findUnique({
    where: { id: coupon.id, isActive: true },
    select: {
      id: true,
      code: true,
      discount: true,
      type: true,
      maxUses: true,
      usedCount: true
    }
  });

  if (!couponData) {
    throw new CustomError('Coupon not found or inactive', 404);
  }

  if (couponData.maxUses && couponData.usedCount >= couponData.maxUses) {
    throw new CustomError('This coupon has reached its maximum usage limit', 400);
  }

  return await prisma.$transaction(async (tx) => {
    const couponUsage = await tx.couponUsage.create({
      data: {
        coupon: { connect: { id: coupon.id } },
        deviceId,
        expiresAt,
        usedAt: new Date()
      }
    });

    const discountedProducts = [];

    for (const product of products) {
      const { originalPrice, discountPrice } = applyDiscountToProduct(lang,product, coupon);
      const discountedProduct = await tx.discountedProduct.create({
        data: {
          coupon: { connect: { id: coupon.id } },
          product: { connect: { id: product.id } },
          CouponUsage: { connect: { id: couponUsage.id } },
          originalPrice,
          discountPrice,
          expiresAt,
          deviceId
        },
        include: {
          product: {
            include: {
              translations: {
                where: { language: normalizeLanguage(lang) }
              },
              images: true,
              category: true
            }
          }
        }
      });
      discountedProducts.push(discountedProduct);
    }

    await tx.coupon.update({
      where: { id: coupon.id },
      data: {
        usedCount: { increment: 1 }
      }
    });

    const formattedProducts = discountedProducts.map(dp => ({
      id: dp.product.id,
      translations: dp.product.translations,
      images: dp.product.images?.map(img => img.url),
      originalPrice: parseFloat(dp.originalPrice),
      price: parseFloat(dp.discountPrice),
      discountAmount: parseFloat((dp.originalPrice - dp.discountPrice).toFixed(2)),
      discountPercentage: coupon.type === 'PERCENT'
        ? coupon.discount
        : parseFloat((((dp.originalPrice - dp.discountPrice) / dp.originalPrice) * 100).toFixed(1)),
      expiresAt: dp.expiresAt
    }));

    return {
      id: coupon.id,
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      expiresAt,
      affectedProducts: formattedProducts.length,
      products: formattedProducts
    };
  });
};


const useCoupon = async (lang, code, deviceId) => {
  if (!deviceId) {
    throw new CustomError('Device ID is required', 400);
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code, isActive: true },
    select: {
      id: true,
      code: true,
      discount: true,
      type: true,
      validTo: true,
      maxUses: true,
      usedCount: true,
      isActive: true
    }
  });

  if (!coupon) {
    throw new CustomError('Invalid or inactive coupon code', 400);
  }

  if (coupon.validTo && new Date(coupon.validTo) < new Date()) {
    throw new CustomError('This coupon has expired', 400);
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new CustomError('This coupon has reached its maximum usage limit', 400);
  }

  // Check if this device has already used this coupon
  const existingUsage = await prisma.couponUsage.findFirst({
    where: {
      couponId: coupon.id,
      deviceId,
      expiresAt: { gte: new Date() }
    }
  });

  if (existingUsage) {
    throw new CustomError('This coupon has already been used with this device', 400);
  }
  const res = await applyCouponToProducts(lang, coupon, deviceId);

  return res;
};


const getDiscountedProducts = async (lang = "AR", deviceId) => {
  const now = new Date();
  const couponUsage = await prisma.couponUsage.findFirst({
    where: {
      deviceId,
      expiresAt: { gte: now }
    },
    select: {
      id: true,
      couponId: true,
      deviceId: true,
      expiresAt: true,
      coupon: {
        select: {
          id: true,
          code: true,
          discount: true,
          type: true,
          isActive: true
        }
      }
    }
  });

  if (!couponUsage || !couponUsage.coupon.isActive) {
    return [];
  }

  const discountedProducts = await prisma.discountedProduct.findMany({
    where: {
      couponId: couponUsage.couponId,
      deviceId,
      expiresAt: { gte: now }
    },
    include: {
      product: {
        include: {
          translations: {
            where: {
              language: normalizeLanguage(lang)
            }
          },
          images: true,
          category: true
        },
      }
    }

  });



  return {
    coupon: {
      id: couponUsage.coupon.id,
      code: couponUsage.coupon.code,
      discount: couponUsage.coupon.discount,
      type: couponUsage.coupon.type,
      expiresAt: couponUsage.expiresAt
    },
    products: discountedProducts.map(dp => ({
      id: dp.product.id,
      translations: dp.product.translations,
      images: dp.product.images?.map(img => img.url) || [],
      categoryName: dp.product.category.name,
      categoryImage: dp.product.category.imageUrl,
      originalPrice: parseFloat(dp.originalPrice),
      price: parseFloat(dp.discountPrice),
      discountAmount: parseFloat((dp.originalPrice - dp.discountPrice).toFixed(2)),
      discountPercentage: couponUsage.coupon.type === 'PERCENT'
        ? couponUsage.coupon.discount
        : parseFloat((((dp.originalPrice - dp.discountPrice) / dp.originalPrice) * 100).toFixed(1))
    }))
  };
};

module.exports = {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  useCoupon,
  getDiscountedProducts,
};
