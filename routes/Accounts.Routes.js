import express from 'express';
// import { register, verifyEmail } from '../controllers/authController.js';
import { register, verifyEmail } from '../controllers/Account.Controllers.js'; 

const accountRouter = express.Router();

accountRouter.post('/register', register);       // Đăng ký & gửi email
accountRouter.get('/verify-email', verifyEmail); // Xác thực từ email link

export default accountRouter;
