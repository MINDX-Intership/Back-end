import express from 'express';
import {
  grantAccess,
  updateAccess,
  deleteAccess
} from '../controllers/AdminAccessControl.Controller.js';

import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

// Tất cả đều là chức năng của admin
router.post('/grant', authVerify, requireUserAdmin, grantAccess);        // Cấp quyền
router.put('/update', authVerify, requireUserAdmin, updateAccess);       // Chỉnh sửa quyền
router.delete('/delete/:userId', authVerify, requireUserAdmin, deleteAccess); // Xóa quyền

export default router;
