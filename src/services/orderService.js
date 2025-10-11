const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');

class OrderService {
  async createOrder(userFirstName, userLastName, provinceId, city, address, phoneNumber, secondPhoneNumber, items) {
    const province = await prisma.province.findUnique({
      where: { id: provinceId },
      select: { id: true, code: true }
    });

    if (!province) {
      throw new CustomError('Invalid province', 400);
    }

    let totalPrice = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      console.log("Product",product)
      if (!product) {
        throw new CustomError('product_not_found', 404);
      }

      if (product.stock < item.quantity) {
        throw new CustomError('insufficient_stock', 400);
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
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
          },
          city,
          address,
          phoneNumber,
          secondPhoneNumber,
          userFirstName,
          userLastName,
          totalPrice,
          status: 'pending',
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
    });

    return order;
  }

  async getOrders() {
    return await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        province: {
          select: {
            id: true,
            code: true
            
          }
        }
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
            product: true
          }
        },
        province: {
          select: {
            id: true,
            name: true
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
            product: true
          }
        }
      }
    });
  }
}

module.exports = new OrderService();
