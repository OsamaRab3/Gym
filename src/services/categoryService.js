const prisma = require('../prisma/prisma')
const CustomError = require('../errors/CustomError')


class CategoryService {

  async getAllCategories() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(name) {
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      throw new CustomError('category_exists',409);
    }

    return await prisma.category.create({
      data: { name }
    });
  }


  async updateCategory(id, name) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!category) {
      throw new CustomError('category_not_found',404);
    }

    if (name && name !== category.name) {
      const nameExists = await prisma.category.findFirst({
        where: { 
          name,
          NOT: { id: parseInt(id) }
        }
      });

      if (nameExists) {
        throw new CustomError('category_name_taken',404);
      }
    }

    return await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name }
    });
  }

  async deleteCategory(id) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { 
        _count: { 
          select: { products: true } 
        } 
      }
    });

    if (!category) {
      throw new CustomError('category_not_found',404);
    }

    if (category._count.products > 0) {
      throw new CustomError('category_has_products',403);
    }

    return await prisma.category.delete({
      where: { id: parseInt(id)}
    });
  }

  async getCategoryById(id) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new Error('category_not_found',404);
    }

    return category;
  }
}

module.exports = new CategoryService();
