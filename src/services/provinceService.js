const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');
const normalizeLanguage = (lang) => {
  if (!lang) return 'AR';
  const upper = String(lang).toUpperCase();
  return upper === 'EN' ? 'EN' : 'AR';
};

class ProvinceService {
  async getAllProvinces(lang) {
    const language = normalizeLanguage(lang);
    return await prisma.province.findMany({
      where: {
        translations: {
          some: {
            language
          }
        }
      },
      include:{
        translations: true
      },
    });
  }

  async getProvinceById(lang,id) {
    const language = normalizeLanguage(lang);
    const province = await prisma.province.findUnique({
      where: { id },
      include: {
        translations: {
          where:{
            language
          }
        }
      }
    });

    if (!province) {
      throw new CustomError('province_not_found', 404);
    }

    return province;
  }

  async createProvince(lang, name) {
    const language = normalizeLanguage(lang);
    const existing = await prisma.provinceTranslation.findFirst({
      where: {
        name
      }
    })
    if (existing) {
      throw new CustomError('province_already_exist', 409)
    }

    return await prisma.province.create({
      data: {
        translations: {
          create: { name, language }
        }
      }, include: {
        translations: true
      }
    });
  }

  async updateProvince(id, name) {
    const existing = await prisma.province.findUnique({
      where: {
        id
      },
      include: {
        deliveryFees: {
          select: { productId: true, fee: true }
        }
      }
    })
    if (!existing) {
      throw new CustomError("province_not_found", 404)
    }

    const duplicate = await prisma.province.findFirst({
      where: {
        code: name,
        NOT: { id }
      }
    });

    if (duplicate) {
      throw new CustomError("province_already_exist", 409);
    }

    return await prisma.province.update({
      where: { id },
      data: { code: name }
    });

  }

  async deleteProvince(lang, id) {

    const ordersCount = await prisma.order.count({
      where: { provinceId: id }
    });

    if (ordersCount > 0) {
      throw new CustomError("cannot_delete_province_with_orders", 400);
    }

    const province = await prisma.province.findUnique({
      where: { id },
      include: { translations: true }
    });
    
    if (!province) {
      throw new CustomError("province_not_found", 404);
    }

    await prisma.provinceTranslation.deleteMany({
      where: { provinceId: id }
    });

    await prisma.deliveryFee.deleteMany({
      where: { provinceId: id }
    });

    return await prisma.province.delete({
      where: { id }
    });
  }

  async addOrUpdateDeliveryFee(provinceId, productId, fee) {
    const [province, product] = await Promise.all([
      prisma.province.findUnique({ where: { id: parseInt(provinceId) } }),
      prisma.product.findUnique({ where: { id: parseInt(productId) } })
    ]);

    if (!province) {
      throw new CustomError('province_not_found', 404);
    }
    if (!product) {
      throw new CustomError('product_not_found', 404);
    }

    return await prisma.deliveryFee.upsert({
      where: {
        provinceId_productId: {
          provinceId: parseInt(provinceId),
          productId: parseInt(productId)
        }
      },
      update: { fee: parseFloat(fee) },
      create: {
        provinceId: parseInt(provinceId),
        productId: parseInt(productId),
        fee: parseFloat(fee)
      }
    });
  }

  async removeDeliveryFee(provinceId, productId) {


    const [province, product] = await Promise.all([
      prisma.province.findUnique({ where: { id: parseInt(provinceId) } }),
      prisma.product.findUnique({ where: { id: parseInt(productId) } })
    ]);

    if (!province) {
      throw new CustomError('province_not_found', 404);
    }
    if (!product) {
      throw new CustomError('product_not_found', 404);
    }

    return await prisma.deliveryFee.delete({
      where: {
        provinceId_productId: {
          provinceId: parseInt(provinceId),
          productId: parseInt(productId)
        }
      }
    });
  }
}

module.exports = new ProvinceService();
