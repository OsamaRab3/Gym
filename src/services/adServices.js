const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');

const deactivateExpiredAds = async () => {
  const now = new Date();
  const expiredAds = await prisma.ad.findMany({
    where: {
      isActive: true,
      endDate: { lt: now },
    },
  });

  if (expiredAds.length === 0) return;

  await prisma.ad.updateMany({
    where: {
      isActive: true,
      endDate: { lt: now },
    },
    data: {
      isActive: false,
    },
  });
};

const createAd = async ({ isActive = false, discountValue, endDate, productId }) => {

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  let end = new Date(endDate)
  if (end < new Date()) {
    throw new CustomError("The end date should be in future ", 400);
  }
  const ad = await prisma.ad.create({
    data: {
      isActive: true,
      discountValue,
      endDate,
      productId,
    },
    include: {
      product: true,
    }
  });
  let discount = 0;
  if (product.discount !== 0) {
    discount = product.discount;

  }

  let baseDiscount = product.discount || 0;
  const priceAfterBaseDiscount = product.price - (product.price * (baseDiscount / 100));
  const discountedPrice = priceAfterBaseDiscount - (priceAfterBaseDiscount * (discountValue / 100));

  return {
    id: ad.id,
    discountValue: ad.discountValue,
    startDate: ad.startDate,
    endDate: ad.endDate,
    product: {
      id: ad.product.id,
      name: ad.product.name,
      originalPrice: ad.product.price,
      baseDiscount,
      adDiscount: discountValue,
      finalPrice: discountedPrice,
      offer: `Price after applying ${baseDiscount}% base discount and ${discountValue}% ad discount is ${discountedPrice} `,
    },
  };
};


const deleteAd = async (id) => {
  await deactivateExpiredAds();
  const ad = await prisma.ad.findUnique({ where: { id } });

  if (!ad) {
    throw new CustomError('Ad not found', 404);
  }

  await prisma.ad.delete({ where: { id } });

  return { id };
};

const getAdById = async (id) => {
  await deactivateExpiredAds();
  const ad = await prisma.ad.findUnique({
    where: { id },

    include: {
      product: true,
    },
  });

  if (!ad) {
    throw new CustomError('Ad not found', 404);
  }
  const product = await prisma.product.findUnique({ where: { id: ad.productId } });
  let baseDiscount = product.discount || 0;
  const priceAfterBaseDiscount = product.price - (product.price * (baseDiscount / 100));
  const discountedPrice = priceAfterBaseDiscount - (priceAfterBaseDiscount * (ad.discountValue / 100));


  return {
    id: ad.id,
    discountValue: ad.discountValue,
    startDate: ad.startDate,
    endDate: ad.endDate,
    isActive: ad.isActive,
    product: {
      id: ad.product.id,
      name: ad.product.name,
      originalPrice: ad.product.price,
      baseDiscount,
      adDiscount: ad.discountValue,
      finalPrice: discountedPrice,
      offer: `Price after applying ${baseDiscount}% base discount and ${ad.discountValue}% ad discount is ${discountedPrice} `,
    },
  };
};


const getAllAds = async () => {
  await deactivateExpiredAds();
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      isActive: true,
      discountValue: true,
      startDate: true,
      endDate: true,
      productId: true
    }
  })

  return ads;
}

module.exports = {
  createAd,
  deleteAd,
  getAdById,
  getAllAds

};
