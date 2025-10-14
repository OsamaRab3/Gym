const prisma = require('../prisma/prisma')
const CustomError = require('../errors/CustomError')

const normalizeLanguage = (lang) => {
  if (!lang) return 'AR';
  const upper = String(lang).toUpperCase();
  return upper === 'EN' ? 'EN' : 'AR';
};

class CategoryService {

  async getAllCategories(lang) {
    const language = normalizeLanguage(lang)
    return await prisma.category.findMany({
      where: {
        translations: { some: { language } }
      },
      include: {
        translations: {
          where: { language }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createCategory(lang, name, images) {
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      throw new CustomError('category_exists', 409);
    }

    const category = await prisma.category.create({
      data: {
        name,
        imageUrl: images,
        translations: {
          create: {
            name, language: normalizeLanguage(lang)
          }
        }

      },
      include: {
        translations: true
      }

    });
    return category;
  }

  async updateCategory(lang, id, name, image) {
    const language = normalizeLanguage(lang);

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: true
      }
    });

    if (!category) {
      throw new CustomError('category_not_found', 404);
    }

    if (name) {
      const nameExists = await prisma.category.findFirst({
        where: {
          name: { equals: name, lt: 'insensitive' },
          NOT: { id }
        }
      });

      if (nameExists) {
        throw new CustomError('category_name_taken', 400);
      }
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.imageUrl = image;
    const existingTranslation = category.translations.find(t => t.language === language);

    return await prisma.$transaction(async (prisma) => {
      if (Object.keys(updateData).length > 0) {
        await prisma.category.update({
          where: { id },
          data: updateData
        });
      }
      if (existingTranslation) {
        await prisma.categoryTranslation.update({
          where: { id: existingTranslation.id },
          data: { name }
        });
      } 

      return prisma.category.findUnique({
        where: { id },
        include: {
          translations: true
        }
      });
    });
  }

  async deleteCategory(id) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true },
          take: 1 
        }
      }
    });

    if (!category) {
      throw new CustomError('category_not_found', 404);
    }


    return await prisma.$transaction(async (prisma) => {
      await prisma.categoryTranslation.deleteMany({
        where: { categoryId: id }
      });
      return await prisma.category.delete({
        where: { id },
        include: {
          translations: true,
          products: true
        }
      });
    });
  }

  async getCategoryById(lang, id) {
    const category = await prisma.category.findUnique({
      where: {
        id, translations: {
          some: {
            language: normalizeLanguage(lang)
          }
        }
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                translations: {
                  some: { language: normalizeLanguage(lang) }
                }
              }
            }
          }
        },
        translations: true
      }
    });

    if (!category) {
      throw new Error('category_not_found', 404);
    }

    return category;
  }
}

module.exports = new CategoryService();
