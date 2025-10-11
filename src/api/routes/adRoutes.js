const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const verifyToken = require('../../middleware/verifyToken')
const allowTo = require('../../middleware/allowTo')

router.post('/:productId/products',verifyToken,allowTo('ADMIN'), adController.createAd);
router.delete('/:id', verifyToken,allowTo('ADMIN'),adController.deleteAd);
router.get('/:id', adController.getAd);


module.exports = router;
