const { validationResult } = require('express-validator');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const CustomError = require('../../errors/CustomError');
const { contactUs } = require('../../services/contactusService');


const submitContactForm = asyncErrorHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array({ onlyFirstError: true })[0];
        const errorMessage = req.t(firstError.msg);
        return next(new CustomError(errorMessage, 400));
    }

    try {
        const { userName, userEmail, subject, message } = req.body;
        
        await contactUs(userName, userEmail, message, subject, req.t);

        res.status(200).json({
            status: 'success',
            message: req.t('contact_message_sent')
        });
    } catch (error) {
        console.error('Contact form error:', error);
        next(error);
    }
});

module.exports = {
    submitContactForm,
};