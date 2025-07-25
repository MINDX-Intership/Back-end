import express from 'express';
import sprintController from '../controllers/Sprints.Controller.js';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const sprintRouter = express.Router();

sprintRouter.post('/add', authVerify, sprintController.createSprint);   // Xem lịch làm việc
sprintRouter.get('/all', authVerify, sprintController.getSprint)            // Thêm lịch làm việc
sprintRouter.post('/add', authVerify, sprintController.createSprint);             // Thêm sprint 
sprintRouter.get('/all', authVerify, sprintController.getSprint); // Lấy tất cả sprint được tạo bởi người dùng
sprintRouter.delete('/delete/:id', authVerify, sprintController.deleteSprint); // Xóa sprint (chỉ người tạo mới được phép xóa)


export default sprintRouter;
