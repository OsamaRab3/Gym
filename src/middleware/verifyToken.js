const jwt = require('jsonwebtoken');
const env = require("../config/environment");
const CustomError = require("../errors/CustomError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new CustomError(req.t('missing_or_invalid_auth_header'), 401));
  }

  const token = authHeader.split(' ')[1]; 
  if (!token) {
    return next(new CustomError(req.t('no_token_provided'), 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return next(new CustomError(req.t('invalid_token'), 401));
  }
};

module.exports = verifyToken;
