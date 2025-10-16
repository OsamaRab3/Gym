const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');

class OrderService {
  async calculateDeliveryFee(provinceId, weight) {
    if (weight <= 0) {
      return 0;
    }

    const deliveryFeeConfig = await prisma.deliveryFee.findFirst({
      where: {
        provinceId,
      },
      orderBy: {
        minWeight: 'desc'
      }
    });

    if (!deliveryFeeConfig) {
      const baseFee = 70;
      const additionalKgFee = 7;
      const additionalWeight = Math.ceil(Math.max(0, weight - 1));
      return baseFee + (additionalWeight * additionalKgFee);
    }

    const baseFee = deliveryFeeConfig.baseFee;
    const additionalKgFee = deliveryFeeConfig.additionalFeePerKg;
    const additionalWeight = Math.ceil(Math.max(0, weight - 1));

    return baseFee + (additionalWeight * additionalKgFee);
  }

  async createOrder(userFirstName, userLastName, provinceId, city, address, phoneNumber, secondPhoneNumber, items) {
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
      select: { id: true }
    });

    if (!province) {
      throw new CustomError('Invalid province', 400);
    }
    let totalFee = 0;
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new CustomError('product_not_found', 404);
      }

      if (product.stock < item.quantity) {
        throw new CustomError('insufficient_stock', 400);
      }

      totalPrice += product.price * item.quantity;
      totalFee += await this.calculateDeliveryFee(provinceId, product.weight)
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }


    const order = await prisma.$transaction(async (prisma) => {

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return await prisma.order.create({
        data: {
          province: {
            connect: { id: provinceId }
          }, city, address, phoneNumber, secondPhoneNumber, userFirstName, userLastName, totalPrice, totalFee: parseFloat(totalFee), status: 'pending', orderItems: { create: orderItems }
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  price: true,
                  weight: true,
                  rank: true,
                  images: {
                    where: {
                      isPrimary: true
                    }, select: {
                      url: true
                    }
                  },
                  translations: true
                }
              }
            }
          }
        }
      }, { timeout: 1000 });
    });

    return order;
  }

  async getOrders() {
    return await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                weight: true,
                price: true,
                rank: true,
                images: {
                  where: {
                    isPrimary: true
                  }, select: {
                    url: true
                  }
                },
                translations: true
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getOrderById(id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                weight: true,
                price: true,
                rank: true,
                images: {
                  where: {
                    isPrimary: true
                  }, select: {
                    url: true
                  }
                },
                translations: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new CustomError('order_not_found', 404);
    }

    return order;
  }

  async updateOrderStatus(id, status) {

    return await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                weight: true,
                price: true,
                rank: true,
                images: {
                  where: {
                    isPrimary: true
                  }, select: {
                    url: true
                  }
                },
                translations: true
              }
            }
          }
        }
      }
    });
  }
}

module.exports = new OrderService();
