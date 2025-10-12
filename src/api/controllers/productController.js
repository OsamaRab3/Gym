const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const status = require('../../utils/status');
const productServices = require('../../services/productServices');
const fs = require('fs');
const path = require('path');


const validateOrThrow = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.files && req.files.length > 0) {
            cleanupUploads(req.files);
        }
        const detailKey = errors.array()[0].msg;
        throw new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400);
    }
}
const cleanupUploads = (files = []) => {
    files.forEach(file => {
        if (file && file.path) {
            const filePath = path.join(process.cwd(), file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    });
};


const createProduct = asyncErrorHandler(async (req, res, next) => {
    validateOrThrow(req);

    try {
        const { name, description, color, price, stock, discount, weight, manufacturer, categoryName, rank } = req.body;
        const lang = req.query.lang || req.body.lang || 'AR';

        const files = req.files ? (Array.isArray(req.files) ? req.files : [req.files]) : [];

        const images = files.map((file, index) => ({
            url: `/uploads/${file.filename}`,
            isPrimary: index === 0
        }));
        const product = await productServices.createProduct({ name, description, color, price, stock, discount, weight, manufacturer, categoryName, rank, lang, images });

        res.status(201).json({
            message: req.t('product_created'),
            status: status.SUCCESS,
            data: product,
        });
    } catch (error) {
        if (req.files && req.files.length > 0) {
            cleanupUploads(req.files);
        }
        next(error);
    }
});


const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    validateOrThrow(req);

    const { id } = req.params;
    await productServices.deleteProduct(id);

    res.status(200).json({
        message: req.t('product_deleted'),
        status: status.SUCCESS,
        data: { id },
    });
});


const getAllProducts = asyncErrorHandler(async (req, res) => {
    const lang = req.query.lang || 'ar';
    const products = await productServices.getAllProducts(lang);

    res.status(200).json({
        message: req.t('products_retrieved'),
        status: status.SUCCESS,
        data: products,

    });
});


const getProductById = asyncErrorHandler(async (req, res, next) => {
    validateOrThrow(req);
    const { id } = req.params;
    const lang = req.query.lang || 'AR';

    const product = await productServices.getProductById(id, lang);

    res.status(200).json({
        message: req.t('product_retrieved'),
        status: status.SUCCESS,
        data: product,
    });
});

const updateProduct = asyncErrorHandler(async (req, res, next) => {
    validateOrThrow(req);

    const { id } = req.params;
    const { name, description, color, price, stock, discount, weight, manufacturer, categoryName, rank } = req.body;
    const lang = req.query.lang || 'AR';
    const files = req.files ? (Array.isArray(req.files) ? req.files : [req.files]) : [];
    const images = files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        isPrimary: index === 0
    }));

    const updatedProduct = await productServices.updateProduct(id, name, description, color, price, stock, discount, weight, manufacturer, categoryName, rank, lang, images);

    res.status(200).json({
        message: req.t('product_updated'),
        status: status.SUCCESS,
        data: updatedProduct,
    });

});

const updateProductRank = asyncErrorHandler(async (req, res, next) => {
    validateOrThrow(req);

    const { id } = req.params;
    const { rank } = req.body;
    if (typeof rank === 'undefined') {
        return next(new CustomError(req.t('rank_required'), 400));
    }

    const updatedProduct = await productServices.updateProductRank(id, rank);

    res.status(200).json({
        message: req.t('product_rank_updated'),
        status: status.SUCCESS,
        data: updatedProduct,
    });
});


const setPrimaryImage = asyncErrorHandler(async (req, res, next) => {
    const { productId, imageId } = req.params;

    const updatedImage = await productServices.setPrimaryImage(productId, imageId);

    res.status(200).json({
        message: req.t('primary_image_updated'),
        status: status.SUCCESS,
        data: updatedImage,
    });
});


const searchProducts = asyncErrorHandler(async (req, res) => {
    const { q, language = 'EN' } = req.query;

    if (!q) {
        return res.status(200).json({
            message: req.t('no_search_query'),
            status: status.SUCCESS,
            data: [],
        });
    }

    const results = await productServices.searchProducts(q, language);

    res.status(200).json({
        message: req.t('search_results'),
        status: status.SUCCESS,
        data: results,
    });
});

module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductRank,
    setPrimaryImage,
    searchProducts
};
