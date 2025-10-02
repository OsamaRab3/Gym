
const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler')
const CustomError = require('../../errors/CustomError')
const authServices = require('../../services/authService')
const status = require('../../utils/status')



const login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const detailKey = errors.array()[0].msg;
        return next(new CustomError(req.t('validation_error_with_detail', req.t(detailKey)), 400))
    }
    const result =  await authServices.login(email,password)

    res.status(200).json({
        message: req.t('login_success'),
        status: status.SUCCESS,
        data:{
            ...result
        }
       
    })

})



module.exports = {
    login,
    // signup
}








