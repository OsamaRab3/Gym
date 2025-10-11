const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');

const createAd = async ({ isActive = false, discountValue, endDate, productId }) => {

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new CustomError('Product not found', 404);
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
  let discount=0;
  if (product.discount!==0){
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
  const ad = await prisma.ad.findUnique({ where: { id } });

  if (!ad) {
    throw new CustomError('Ad not found', 404);
  }

  await prisma.ad.delete({ where: { id } });

  return { id };
};

const getAdById = async (id) => {
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


module.exports = {
  createAd,
  deleteAd,
  getAdById,

};
