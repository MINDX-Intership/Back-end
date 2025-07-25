import express from 'express';
import { createSupportRequest, getMySupportRequests, deleteSupportRequest } from '../controllers/SupportRequests.Controller.js';
import { authVerify, requireAccountAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

router.post('/create', authVerify, createSupportRequest);              // Gửi yêu cầu hỗ trợ
router.get('/my-requests', authVerify, requireAccountAdmin, getMySupportRequests);         // Xem danh sách yêu cầu account - users
router.delete('/delete/:id', authVerify, deleteSupportRequest);       // Xóa yêu cầu hỗ trợ

export default router;
