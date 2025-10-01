
const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler')
const CustomError = require('../../errors/CustomError')
const authServices = require('../../services/authService')
const status = require('../../utils/status')



const login = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return next(new CustomError(`Validation errorr ${errors.array()[0].msg}`, 400))
    }
    const result =  await authServices.login(email,password)

    res.status(200).json({
        message: "Login secuess",
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








