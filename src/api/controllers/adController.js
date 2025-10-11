const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const status = require('../../utils/status');
const adServices = require('../../services/adServices');

const createAd = asyncErrorHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const detailKey = errors.array()[0].msg;
    return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400));
  }

  const { discountValue, endDate } = req.body;
  const { productId } = req.params;
  const ad = await adServices.createAd({ discountValue, endDate, productId });

  res.status(201).json({
    message: req.t('ad_created'),
    status: status.SUCCESS,
    data: ad,
  });
});

const deleteAd = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  await adServices.deleteAd(id);

  res.status(200).json({
    message: req.t('ad_deleted'),
    status: status.SUCCESS,
    data: { id },
  });
});

const getAd = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const ad = await adServices.getAdById(id);

  res.status(200).json({
    message: req.t('ad_retrieved'),
    status: status.SUCCESS,
    data: ad,
  });
});


module.exports = {
  createAd,
  deleteAd,
  getAd
};
