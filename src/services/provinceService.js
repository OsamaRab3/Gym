const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');

class ProvinceService {
  async getAllProvinces() {
    return await prisma.province.findMany({
      include: {
        deliveryFees: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async getProvinceById(id) {
    const province = await prisma.province.findUnique({
      where: { id: parseInt(id) },
      include: {
        deliveryFees: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!province) {
      throw new CustomError('province_not_found', 404);
    }

    return province;
  }

  async createProvince(name) {
    const existing = await prisma.province.findUnique({
      where: {
        code:name
      }
    })
    if (existing) {
      throw new CustomError('province_already_exist', 409)
    }

    return await prisma.province.create({
      data: {
        code:name
      }
    });
  }

  async updateProvince(id, name) {
    const existing = await prisma.province.findUnique({
      where: {
        id: parseInt(id)
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
        code:name,
        NOT: { id: parseInt(id) }
      }
    });

    if (duplicate) {
      throw new CustomError("province_already_exist", 409);
    }

    return await prisma.province.update({
      where: { id: parseInt(id) },
      data: { code : name }
    });

  }

  async deleteProvince(id) {
    const existing = await prisma.province.findUnique({
      where: {
        id: parseInt(id)
      }
    })
    if (!existing) {
      throw new CustomError("province_not_found", 404)
    }
    return await prisma.province.delete({
      where: { id: parseInt(id) }
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
