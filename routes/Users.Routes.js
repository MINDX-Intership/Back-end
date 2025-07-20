import express from 'express';
import userController from '../controllers/User.Controllers.js';
// import { authVerify } from '../middlewares/Auth.Middlewares.js';
// import { protect, authorize } from '../middlewares/Auth.Middlewares.js';

const userRouter = express.Router();

// Lấy thông tin tài khoản đã login
// userRouter.get('/me', protect, (req, res) => {
//   res.json({
//     email: req.account.email,
//     role: req.account.role,
//     verified: req.account.isVerified
//   });
// });

// Lấy thông tin cá nhân
userRouter.get('/me', authenticateToken, userController.getUser);

// Cập nhật thông tin cá nhân
userRouter.put('/me', authenticateToken, userController.updateUser);


// // route role cho admin
// userRouter.get('/admin-only', protect, authorize('ADMIN'), (req, res) => {
//   res.json({ message: 'Chỉ ADMIN mới truy cập được route này.' });
// });

export default userRouter;
