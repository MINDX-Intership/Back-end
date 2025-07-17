import express from 'express';
import accountController from '../controllers/Account.Controllers.js';
import { registerValidate, validateLogin, authVerify } from '../middlewares/Auth.Middlewares.js'; // Uncomment if you need to use auth middlewares

const accountRouter = express.Router();

accountRouter.post('/register', registerValidate, accountController.register);       // Đăng ký & gửi email
accountRouter.post('/verify-email', accountController.verifyEmail); // Xác thực từ email link
accountRouter.post('/forgot-password', accountController.forgotPassword); // Quên mật khẩu
accountRouter.post('/reset-password/:token', accountController.resetPassword); // Đặt lại mật khẩu
accountRouter.post('/login', validateLogin, accountController.login);             // Đăng nhập
accountRouter.get('/me', authVerify, accountController.getAccount);           // Lấy thông tin tài khoản đã đăng nhập

export default accountRouter;
