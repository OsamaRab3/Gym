const nodemailer = require('nodemailer');
const CustomError = require('../errors/CustomError');
const env = require('../config/environment');


async function sendContactEmail({
    userName,
    userEmail,
    subject,
    message,
    t = (key) => key
}) {
    try {

        if (!userName || !userEmail || !message) {
            throw new Error(t('missing_required_fields'));
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.GMAIL_Admin,
                pass: env.PASS_EMAIL,
            },
        });

        const isRTL = t('_dir') === 'rtl';
        const direction = isRTL ? 'rtl' : 'ltr';
        const textAlign = isRTL ? 'right' : 'left';

        const htmlMessage = `
            <!DOCTYPE html>
            <html dir="${direction}">
            <head>
                <meta charset="UTF-8">
                <title>${t('contact_form_submission')}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                    .content { margin: 20px 0; }
                    .message { 
                        background: #f5f5f5; 
                        padding: 15px; 
                        border-radius: 5px;
                        text-align: ${textAlign};
                    }
                    .footer { 
                        margin-top: 20px; 
                        font-size: 0.9em; 
                        color: #7f8c8d;
                        border-top: 1px solid #eee;
                        padding-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>${t('contact_form_submission')}</h2>
                    </div>
                    <div class="content">
                        <p><strong>${t('from')}:</strong> ${userName} &lt;${userEmail}&gt;</p>
                        ${subject ? `<p><strong>${t('subject')}:</strong> ${subject}</p>` : ''}
                        <p><strong>${t('message')}:</strong></p>
                        <div class="message">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="footer">
                        <p>${t('email_sent_from_contact_form')}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: `"${env.APP_NAME || 'Gym App'}" <${env.GMAIL_Admin}>`,
            to: env.ADMIN_EMAIL || env.GMAIL_Admin,
            subject: `[${t('contact_form_submission')}] ${subject || ''}`.trim(),
            html: htmlMessage,
            replyTo: `"${userName}" <${userEmail}>`,
            text: `${t('from')}: ${userName} <${userEmail}>
${subject ? `${t('subject')}: ${subject}\n` : ''}
${t('message')}:\n${message}\n\n--\n${t('email_sent_from_contact_form')}`
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new CustomError(
            error.message || t('email_send_failed'),
            error.statusCode || 500
        );
    }
}

module.exports = { sendContactEmail };