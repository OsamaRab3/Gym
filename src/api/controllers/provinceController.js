const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const provinceService = require('../../services/provinceService');

const getAllProvinces = asyncErrorHandler(async (req, res) => {
  const provinces = await provinceService.getAllProvinces();
  
  res.status(200).json({
    success: true,
    message: req.t('provinces_retrieved'),
    data: provinces
  });
});


const getProvinceById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const province = await provinceService.getProvinceById(id);
  
  res.status(200).json({
    success: true,
    message: req.t('province_retrieved'),
    data: province
  });
});

const createProvince = asyncErrorHandler(async (req, res) => {
  const { name } = req.body;
  
  const province = await provinceService.createProvince(name);
  
  res.status(201).json({
    success: true,
    message: req.t('province_created'),
    data: province
  });
});

const updateProvince = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  
  const province = await provinceService.updateProvince(id, name);
  
  res.status(200).json({
    success: true,
    message: req.t('province_updated'),
    data: province
  });
});

const deleteProvince = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  
  await provinceService.deleteProvince(id);
  
  res.status(200).json({
    success: true,
    message: req.t('province_deleted')
  });
});

const updateDeliveryFee = asyncErrorHandler(async (req, res, next) => {
  const { provinceId, productId } = req.params;
  const { fee } = req.body;
  
  const deliveryFee = await provinceService.addOrUpdateDeliveryFee(
    provinceId, 
    productId, 
    fee
  );
  
  res.status(200).json({
    success: true,
    message: req.t('delivery_fee_updated'),
    data: deliveryFee
  });
});

const removeDeliveryFee = asyncErrorHandler(async (req, res, next) => {
  const { provinceId, productId } = req.params;
  
  await provinceService.removeDeliveryFee(provinceId, productId);
  
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
