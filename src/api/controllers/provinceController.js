const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const provinceService = require('../../services/provinceService');

const getAllProvinces = asyncErrorHandler(async (req, res) => {
  const { lang } = req.query || "AR";
  const provinces = await provinceService.getAllProvinces(lang);

  res.status(200).json({
    success: true,
    message: req.t('provinces_retrieved'),
    data: provinces
  });
});


const getProvinceById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { lang } = req.query || "AR";
  const province = await provinceService.getProvinceById(lang,id);

  res.status(200).json({
    success: true,
    message: req.t('province_retrieved'),
    data: province
  });
});

const createProvince = asyncErrorHandler(async (req, res) => {
  const { name } = req.body;
  const { lang } = req.query || "AR";
  const province = await provinceService.createProvince(lang, name);

  res.status(201).json({
    success: true,
    message: req.t('province_created'),
    data: province
  });
});

const updateProvince = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const { lang } = req.query || "AR";


  const province = await provinceService.updateProvince(lang, id, name);

  res.status(200).json({
    success: true,
    message: req.t('province_updated'),
    data: province
  });
});

const deleteProvince = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { lang } = req.query || "AR";


  await provinceService.deleteProvince(lang, id);

  res.status(200).json({
    success: true,
    message: req.t('province_deleted')
  });
});

const updateDeliveryFee = asyncErrorHandler(async (req, res, next) => {
  const { provinceId, productId } = req.params;
  const { fee } = req.body;
  const { lang } = req.query || "AR";

  const deliveryFee = await provinceService.addOrUpdateDeliveryFee(lang, provinceId, productId, fee);

  res.status(200).json({
    success: true,
    message: req.t('delivery_fee_updated'),
    data: deliveryFee
  });
});

const removeDeliveryFee = asyncErrorHandler(async (req, res, next) => {
  const { provinceId, productId } = req.params;
  const { lang } = req.query || "AR";

  await provinceService.removeDeliveryFee(lang, provinceId, productId);

  res.status(200).json({
    success: true,
    message: req.t('delivery_fee_removed')
  });
});

module.exports = {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
  updateDeliveryFee,
  removeDeliveryFee
};
