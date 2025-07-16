import express from 'express';
import { register, verifyEmail, forgotPassword, resetPassword, login, getAccount } from '../controllers/Account.Controllers.js'; 

const accountRouter = express.Router();

accountRouter.post('/register', register);       // Đăng ký & gửi email
accountRouter.post('/verify-email', verifyEmail); // Xác thực từ email link
accountRouter.post('/forgot-password', forgotPassword); // Quên mật khẩu
accountRouter.post('/reset-password/:token', resetPassword); // Đặt lại mật khẩu
accountRouter.post('/login', login);             // Đăng nhập
accountRouter.get('/me', getAccount);           // Lấy thông tin tài khoản đã đăng nhập

export default accountRouter;
