const CustomError = require('../errors/CustomError')
const { t } = require('../utils/i18n')

module.exports = {
    NotFound:(req,res,next)=>{
      const message = t(req.lang, 'not_found_with_url', req.originalUrl)
      const error = new CustomError (message,404)
      next(error)
    },
    globalError:(error, req, res, next) => {
  
        error.statusCode = error.statusCode || 500;
        error.status = error.status || "error"
      
        res.status(error.statusCode).json({
          status:error.status,
          message:error.message
        })
    },
    
}