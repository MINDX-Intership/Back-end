import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = async (to, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `
            <p>Hãy vui lòng ấn vào đường link phía dưới để đặt lại mật khẩu</p>
            <p><a href='${resetUrl}'>Link</a></p>
            <p>Đường link này sẽ hết hạn sau 1 tiếng</p>
        `
    };

    await transporter.sendMail(mailOptions);
};