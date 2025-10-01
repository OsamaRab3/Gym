const jwt = require('jsonwebtoken');
const env = require("../config/environment");
const CustomError = require("../errors/CustomError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new CustomError("Missing or invalid authorization header", 401));
  }

  const token = authHeader.split(' ')[1]; 
  if (!token) {
    return next(new CustomError("Access denied. No token provided.", 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return next(new CustomError("Invalid token.", 401));
  }
};

module.exports = verifyToken;
