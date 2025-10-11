const express = require('express')
const router = express.Router()

const verifyToken = require('../../middleware/verifyToken')
const prisma = require('../../prisma/prisma')
const productController = require('../controllers/productController')
const allowTo = require('../../middleware/allowTo')
const { multupload } = require('../../utils/fileUpload');
const multer = require('multer');
const upload = multer();


// const { 
//   // createProductValidation, 
//   updateProductValidation, 
//   idParamValidation, 
//   updateProductRankValidation 
// } = require('../../validation/product.validation')

router.route('/')
  .get(productController.getAllProducts)
  .post( multupload('images'), productController.createProduct)
// verifyToken, allowTo("ADMIN")
router.route('/:id')
  .get( productController.getProductById)
  .put( multupload('images'),productController.updateProduct)
  .delete(verifyToken, allowTo("ADMIN"), productController.deleteProduct)


router.route('/:id/rank')
  .patch(verifyToken, allowTo("ADMIN"), productController.updateProductRank)

module.exports = router;
