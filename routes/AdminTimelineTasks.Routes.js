import express from 'express';
import {
    getAllTimelineTasks,
    addTimelineTask,
    updateTimelineTask,
    deleteTimelineTask,
    getTimelineTasksByUser  
} from '../controllers/AdminTimelineTasks.Controllers.js';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

// Yêu cầu đăng nhập và là admin
router.use(authVerify);
router.use(requireUserAdmin);

// Lấy toàn bộ timeline task của tất cả người dùng
router.get('/', getAllTimelineTasks);

// Thêm timeline task cho người dùng
router.post('/add', addTimelineTask);

// Cập nhật task theo ID
router.put('/update/:id', updateTimelineTask);

// Xóa task theo ID
router.delete('/delete/:id', deleteTimelineTask);

// Lấy timeline task của một người dùng cụ thể
router.get('/user/:userId', getTimelineTasksByUser);

export default router;
