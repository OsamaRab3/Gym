const CustomError = require("../errors/CustomError");

module.exports = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new CustomError(
            "Access denied. You do not have the required permissions.",
            403
          )
        );
      }
      next();
    } catch (error) {
      console.error("Authorization middleware error:", error);
      next(error);
    }
  };
};
