const express = require('express');
const router = express.Router();

const verifyToken = require('../../middleware/verifyToken');
const productController = require('../controllers/productController');
const allowTo = require('../../middleware/allowTo');
const { multupload } = require('../../utils/fileUpload');


const { 
  createProductValidation, 
  // updateProductValidation, 
  // idParamValidation, 
  // updateProductRankValidation,
  // languageQueryValidation
} = require('../../validation/product.validation');




router.route('/')
  .get(productController.getAllProducts)
  .post(
    verifyToken, 
    allowTo("ADMIN"),
    multupload('images'), 
    createProductValidation,
    productController.createProduct
  );


router.route('/:id')
  .get(productController.getProductById)
  .put(
    verifyToken,
    allowTo("ADMIN"),
    multupload('images'),
    productController.updateProduct
  )
  .delete(
    verifyToken, 
    allowTo("ADMIN"), 
    productController.deleteProduct
  );

router.route('/:id/rank')
  .patch(
    verifyToken, 
    allowTo("ADMIN"), 
    productController.updateProductRank
  );

router.patch(
  '/:productId/images/:imageId/set-primary',
  verifyToken,
  allowTo("ADMIN"),
  productController.setPrimaryImage
);


router.get(
  '/search',
  productController.searchProducts
);

module.exports = router;
