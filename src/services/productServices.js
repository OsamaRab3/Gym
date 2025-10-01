// creat product => admin 
// delete product => admin 
// get all product 
// get single product 
// update product 
// update product rank 


const prisma = require('../prisma/prisma')
const CustomError = require('../errors/CustomError')


const createProduct = async ({ name, description, price, stock, discount, color, manufacturer, categoryName, imageUrl }) => {
    //   if (!categoryName) {
    //     throw new CustomError("Category name is required", 400);
    //   }

    //   if (isNaN(price) || price <= 0) {
    //     throw new CustomError("Price must be a valid number", 400);
    //   }

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            discount: parseFloat(discount),
            color,
            manufacturer,
            category: {
                connectOrCreate: {
                    where: { name: categoryName },
                    create: { name: categoryName }
                }
            },
            imageUrl
        },
        include: {
            category: true
        }
    });

    return product;
}

const deleteProduct = async (id) => {
    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
        throw new CustomError('Product not found', 404);
    }
    await prisma.product.delete({ where: { id: parseInt(id) } })
    return { id };
}

const getAllProducts = async () => {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    return products;
}

const getProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { category: true }
    })
    if (!product) {
        throw new CustomError('Product not found', 404);
    }
    return product;
}

const updateProduct = async (id, data) => {
    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
        throw new CustomError('Product not found', 404);
    }
    const updated = await prisma.product.update({
        where: { id: parseInt(id) },
        data
    })
    return updated;
}

const updateProductRank = async (id, rank) => {
    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
        throw new CustomError('Product not found', 404);
    }
    const updated = await prisma.product.update({
        where: { id: parseInt(id) },
        data: { rank },
    })
    return updated;
}

module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductRank,
}