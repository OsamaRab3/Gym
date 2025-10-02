const CustomError = require('../errors/CustomError');
const {sendContactEmail} = require('../email/email');


const contactUs = async (userName, userEmail, message, subject = null, t) => {
    try {
        if (!userName || !userEmail || !message) {
            throw new CustomError(t('missing_required_fields'), 400);
        }

        const emailSubject = subject || t('contact_form_submission');
        
        await sendContactEmail({ 
            userName, 
            userEmail, 
            subject: emailSubject,
            message,
            t 
        }); 
        
        return { 
            success: true, 
            message: t('contact_message_sent') 
        };
    } catch (error) {
        console.error('Contact service error:', error);
        throw new CustomError(
            error.message || t('contact_message_failed'), 
            error.statusCode || 500
        );
    }
};

module.exports = {
  contactUs,
};