const express = require('express')
const router = express.Router()

const verifyToken = require('../../middleware/verifyToken')
const prisma = require('../../prisma/prisma')
const productController = require('../controllers/productController')
const allowTo = require('../../middleware/allowTo')

router.route('/')
  .get(productController.getAllProducts)
  .post(verifyToken, allowTo("ADMIN"), productController.createProduct)

router.route('/:id')
  .get(productController.getProductById)
  .put(verifyToken, allowTo("ADMIN"), productController.updateProduct)
  .delete(verifyToken,allowTo("ADMIN"), productController.deleteProduct)


router.route('/:id/rank')
  .patch(verifyToken, allowTo("ADMIN"), productController.updateProductRank)

module.exports = router;
