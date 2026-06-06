const nodemailer = require('nodemailer')


// transport
const createTransport = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
}

// Send mail 
const sendMail = async(to, subject, html) => {
    try {
        const transporter = createTransport()

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            html: html,
        })
         console.log('Email send', info.messageId);
         return {
            success: true,
            message: info.messageId
         }

    } catch (error) {
        console.log('Email error', error);
        return {
            success: false,
            message: 'Failed to send mail'
        }
    }
}


// Vendor Approval Email
const sendVendorApprovalEmail = async( email, shopName) => {
    const html = `<h2>🎉 Congratulations!</h2><p>Hello,<p>We are pleased to inform you that your vendor application for <strong>${shopName}</strong> has been reviewed and approved.<p>You can now access your vendor dashboard, manage products, track orders, and start selling on our platform.<p style="margin:30px 0"><a href=${process.env.FRONTEND_URL}/vendor/dashboard style="background-color:#2563eb;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">Go to Vendor Dashboard</a><p>If you have any questions or need assistance, please contact our support team.<p>Thank you for joining our marketplace. We look forward to helping <strong>${shopName}</strong> grow and succeed.<p>Best regards,<br>Marketplace Team</p>`

    await sendMail(email, 'Vendor approval mail', html)
}