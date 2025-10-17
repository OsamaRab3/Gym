const prisma = require('../prisma/prisma');
const CustomError = require('../errors/CustomError');

const normalizeLanguage = (lang) => {
    if (!lang) return 'AR';
    const upper = String(lang).toUpperCase();
    return upper === 'EN' ? 'EN' : 'AR';
};

const createProduct = async ({ name, description, color, price, stock, discount, weight, manufacturer, categoryName, rank, lang, images = [] }) => {

    const imageData = Array.isArray(images) ? images : [];

    const product = await prisma.product.create({
        data: {
            price: parseFloat(price),
            stock: parseInt(stock, 10) || 0,
            discount: discount != null ? parseFloat(discount) : 0,
            weight: weight != null ? parseFloat(weight) : 0,
            rank: rank != null ? parseInt(rank, 10) : null,
            translations: {
                create: {
                    name, description, color, manufacturer, language: normalizeLanguage(lang)
                }

            },
            category: {
                connectOrCreate: {
                    where: {
                        name: categoryName
                    },
                    create: {
                        name: categoryName,
                        translations: {
                            create: {
                                name: categoryName,
                                language: normalizeLanguage(lang)
                            }
                        }
                    }
                }
            },
            images: {
                create: imageData.map((img, index) => ({
                    url: img.url || img.path,
                    isPrimary: index === 0
                }))
            }
        },
        include: {
            translations: true,
            images: true,
            category: {
                where: {
                    translations: { some: { language: normalizeLanguage(lang) } }
                }
            }
        }
    });

    return product;
};


const deleteProduct = async (id) => {
    const existing = await prisma.product.findUnique({
        where: { id },
        include: {
            images: true,
            translations: true,
            Coupon: true
        }
    });

    if (!existing) {
        throw new CustomError('Product not found', 404);
    }

    await prisma.$transaction([
        prisma.discountedProduct.deleteMany({
            where: { productId: id }
        }),
        prisma.orderItem.deleteMany({
            where: { productId: id }
        }),
        prisma.productImage.deleteMany({
            where: { productId: id }
        }),
        prisma.productTranslation.deleteMany({
            where: { productId: id }
        }),
        prisma.product.delete({
            where: { id }
        })
    ]);

    return { id };
};


const getAllProducts = async (lang = 'AR') => {
    const language = normalizeLanguage(lang);
    const products = await prisma.product.findMany({
        where: {
            translations: {
                some: {
                    language: language
                }
            }
        },
        include: {
            translations: {
                where: {
                    language: language
                }
            },
            images: {
                where: { isPrimary: true }
            },
            category: {
                include: {
                    translations: {
                        where: { language: language },
                        select: {
                            name: true,
                            description: true,
                            language: true
                        }
                    }
                }
            },
            offers: {
                where: {
                    isActive: true,
                    startDate: { lte: new Date() },
                    OR: [
                        { endDate: null },
                        { endDate: { gte: new Date() } }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    discountType: true,
                    discountValue: true,
                    productId: true,
                    endDate: true,
                    startDate: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return products;
};


const getProductById = async (id, lang) => {
    const language = normalizeLanguage(lang);

    const product = await prisma.product.findFirst({
        where: { id, translations: { some: { language } } },

        include: {
            translations: {
                where: { language },
                select: {
                    name: true,
                    description: true,
                    color: true,
                    manufacturer: true,
                    language: true
                }
            },
            images: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    translations: {
                        where: { language },
                        select: {
                            name: true,
                            description: true,
                            language: true
                        }
                    }
                }
            },
            offers: {
                where: {
                    isActive: true,
                    startDate: { lte: new Date() },
                    OR: [
                        { endDate: null },
                        { endDate: { gte: new Date() } }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    discountType: true,
                    discountValue: true,
                    productId: true,
                    endDate: true,
                    startDate: true
                }
            }
        }
    });

    if (!product) {
        throw new CustomError(('product_not_found'), 404);
    }
    return product;
};


const updateProduct = async (id, name, description, color, price, stock, discount, weight, manufacturer, categoryName, rank, lang = 'AR', images) => {
    const language = normalizeLanguage(lang);

    const existing = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!existing) {
        throw new CustomError(('product_not_found'), 404);
    }

    const update = await prisma.product.update({
        where: { id },
        data: {
            price: parseFloat(price) || existing.price,
            stock: parseInt(stock) || existing.stock,
            discount: parseFloat(discount) || existing.discount,
            weight: parseFloat(weight) || existing.weight,
        }
    });

    if (images && images.length > 0) {
        await prisma.productImage.deleteMany({
            where: { productId: id }
        });

        await Promise.all(images.map((img, index) =>
            prisma.productImage.create({
                data: {
                    url: img.url,
                    isPrimary: img.isPrimary || index === 0,
                    productId: id
                }
            })
        ));
    }
    if (categoryName) {
        const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {
                translations: {
                    upsert: {
                        where: {
                            categoryId_language: {
                                categoryId: undefined, 
                                language: language
                            }
                        },
                        create: {
                            name: categoryName,
                            language: language
                        },
                        update: {}
                    }
                }
            },
            create: {
                name: categoryName,
                translations: {
                    create: {
                        name: categoryName,
                        language: language
                    }
                }
            },
            include: { translations: true }
        });

        await prisma.product.update({
            where: { id },
            data: { categoryId: category.id }
        });
    }
    if (name || description || color || manufacturer) {
        const existingTranslation = await prisma.productTranslation.findFirst({
            where: { productId: id, language: language }
        });

        if (existingTranslation) {
            await prisma.productTranslation.update({
                where: { id: existingTranslation.id },
                data: {
                    name: name ?? existingTranslation.name,
                    description: description ?? existingTranslation.description,
                    color: color ?? existingTranslation.color,
                    manufacturer: manufacturer ?? existingTranslation.manufacturer
                }
            });
        }

    }

    return await prisma.product.findUnique({
        where: {
            id, translations: {
                some: {
                    language: language
                }
            }
        },

        include: { translations: { where: { language: language } }, images: true, category: true }
    });
};


const updateProductRank = async (id, rank) => {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
        throw new CustomError('Product_not_found', 404);
    }

    return await prisma.product.update({
        where: { id },
        data: { rank: parseInt(rank) },
        include: {
            translations: true,
            images: { where: { isPrimary: true } },
            category: true
        }
    });
};


const setPrimaryImage = async (productId, imageId) => {
    return await prisma.$transaction([
        // Reset all images to not primary
        prisma.productImage.updateMany({
            where: { productId },
            data: { isPrimary: false }
        }),
        // Set the selected image as primary
        prisma.productImage.update({
            where: { id: imageId },
            data: { isPrimary: true }
        })
    ]).then(([_, updatedImage]) => updatedImage);
};


const searchProducts = async (query, language = 'AR') => {
    const lang = normalizeLanguage(language);

    return await prisma.product.findMany({
        where: {
            OR: [
                {
                    translations: {
                        some: {
                            language: lang,
                            OR: [
                                { name: { contains: query, mode: 'insensitive' } },
                                { description: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    }
                }, {
                    translations: {
                        some: {
                            language: lang === 'AR' ? 'EN' : 'AR',
                            OR: [
                                { name: { contains: query, mode: 'insensitive' } },
                                { description: { contains: query, mode: 'insensitive' } }
                            ]
                        }
                    }
                }
            ]
        },
        include: {
            translations: {
                where: { language: lang },
                take: 1
            },
            images: {
                where: { isPrimary: true },
                take: 1
            },
            category: {
                include: {
                    translations: {
                        where: { language: normalizeLanguage(language) },
                        take: 1
                    }
                }
            }
        },
        take: 10
    });
};
const filterProduct = async(lang,categoryName)=>{
    const language = normalizeLanguage(lang);
    const existing = await prisma.category.findUnique({
        where:{
            name: categoryName
        }
    })
    if(!existing){
        throw new CustomError(`This categroy ${categoryName} not foud`,404);
    }

    const products = await prisma.category.findMany({
        where:{
            translations:{
                some:{language}
            },
            name:categoryName
        },
        include:{
            translations:true,
            products: {
                where:{
                    translations:{some:{language}}
                },
                include:{
                    translations:true,
                    images: true
                }
            }
            
        }
    })

    return products; 
}
module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductRank,
    setPrimaryImage,
    searchProducts,
    filterProduct
};