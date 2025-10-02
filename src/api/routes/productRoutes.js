const express = require('express')
const router = express.Router()

const verifyToken = require('../../middleware/verifyToken')
const prisma = require('../../prisma/prisma')
const productController = require('../controllers/productController')
const allowTo = require('../../middleware/allowTo')
const { 
  createProductValidation, 
  updateProductValidation, 
  idParamValidation, 
  updateProductRankValidation 
} = require('../../validation/product.validation')

router.route('/')
  .get(productController.getAllProducts)
  .post(verifyToken, allowTo("ADMIN"), createProductValidation, productController.createProduct)

router.route('/:id')
  .get(idParamValidation, productController.getProductById)
  .put(verifyToken, allowTo("ADMIN"), updateProductValidation, productController.updateProduct)
  .delete(verifyToken, allowTo("ADMIN"), idParamValidation, productController.deleteProduct)


router.route('/:id/rank')
  .patch(verifyToken, allowTo("ADMIN"), updateProductRankValidation, productController.updateProductRank)

module.exports = router;
