
const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler')
const CustomError = require('../../errors/CustomError')
const status = require('../../utils/status')
const productServices = require('../../services/productServices')

const createProduct = asyncErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailKey = errors.array()[0].msg;
        return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
    }

    const { name, description, price, stock, discount, color, manufacturer,categoryName, imageUrl } = req.body;

    const product = await productServices.createProduct({
        name,
        description,
        price,
        stock,
        discount,
        color,
        manufacturer,
        categoryName,
        imageUrl
    })

    res.status(201).json({
        message: req.t('product_created'),
        status: status.SUCCESS,
        data: product,
    })
})

const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailKey = errors.array()[0].msg;
        return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
    }
    const id = req.params.id;
    const result = await productServices.deleteProduct(id)
    res.status(200).json({
        message: req.t('product_deleted'),
        status: status.SUCCESS,
        data: result,
    })
})

const getAllProducts = asyncErrorHandler(async (req, res) => {
    const products = await productServices.getAllProducts()
    res.status(200).json({
        message: req.t('products_retrieved'),
        status: status.SUCCESS,
        data: products,
    })
})

const getProductById = asyncErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailKey = errors.array()[0].msg;
        return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
    }
    const id = req.params.id;
    const product = await productServices.getProductById(id)
    res.status(200).json({
        message: req.t('product_retrieved'),
        status: status.SUCCESS,
        data: product,
    })
})

const updateProduct = asyncErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailKey = errors.array()[0].msg;
        return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
    }
    const id = req.params.id;
    const data = req.body
    if (!data || Object.keys(data).length === 0) {
        return next(new CustomError(req.t('no_update_data_provided'), 400))
    }
    const updated = await productServices.updateProduct(id, data)
    res.status(200).json({
        message: req.t('product_updated'),
        status: status.SUCCESS,
        data: updated,
    })
})

const updateProductRank = asyncErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailKey = errors.array()[0].msg;
        return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
    }
    const id = req.params.id;
    const { rank } = req.body
    if (typeof rank === 'undefined') {
        return next(new CustomError(req.t('rank_required'), 400))
    }
    const updated = await productServices.updateProductRank(id, rank)
    res.status(200).json({
        message: req.t('product_rank_updated'),
        status: status.SUCCESS,
        data: updated,
    })
})

module.exports = {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductRank,
}


