router.patch('/:id', authVerify, requireLeaderOrAdmin, handleSupportRequest);
import express from 'express';
import {
  createSupportResponse,
  getAllSupportResponses,
  handleSupportResponse,
} from '../controllers/SupportResponse.Controller.js';

import { authVerify, requireLeaderOrAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

// MEMBER gửi yêu cầu
router.post('/', authVerify, createSupportResponse);

// LEADER/ADMIN xem tất cả yêu cầu
router.get('/', authVerify, requireLeaderOrAdmin, getAllSupportResponses);

// LEADER/ADMIN xử lý yêu cầu
router.patch('/:id', authVerify, requireLeaderOrAdmin, handleSupportResponse);

export default router;
