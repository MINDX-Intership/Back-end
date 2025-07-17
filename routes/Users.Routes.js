import express from 'express';
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

// // route role cho admin
// userRouter.get('/admin-only', protect, authorize('ADMIN'), (req, res) => {
//   res.json({ message: 'Chỉ ADMIN mới truy cập được route này.' });
// });

export default userRouter;
