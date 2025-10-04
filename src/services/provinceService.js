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
    return await prisma.province.create({
      data: {
        name
      }
    });
  }

  async updateProvince(id, name) {
    try {
      return await prisma.province.update({
        where: { id: parseInt(id) },
        data: { name }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new CustomError('province_not_found', 404);
      }
      throw error;
    }
  }

  async deleteProvince(id) {
    try {
      return await prisma.province.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new CustomError('province_not_found', 404);
      } else if (error.code === 'P2003') {
        throw new CustomError('cannot_delete_province_with_orders', 400);
      }
      throw error;
    }
  }

  async addOrUpdateDeliveryFee(provinceId, productId, fee) {
    // Check if both province and product exist
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
    try {
      return await prisma.deliveryFee.delete({
        where: {
          provinceId_productId: {
            provinceId: parseInt(provinceId),
            productId: parseInt(productId)
          }
        }
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new CustomError('delivery_fee_not_found', 404);
      }
      throw error;
    }
  }
}

module.exports = new ProvinceService();
