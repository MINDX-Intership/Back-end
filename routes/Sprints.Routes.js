import express from 'express';
import sprintController from '../controllers/Sprints.Controller.js';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const sprintRouter = express.Router();

sprintRouter.get('/my-schedule', authVerify, sprintController.getMySchedule);     // Xem lịch làm việc
sprintRouter.post('/add', authVerify, sprintController.addSchedule);             // Thêm lịch làm việc
sprintRouter.post('/add', authVerify, sprintController.createSprint);             // Thêm sprint 
sprintRouter.get('/all', authVerify, sprintController.getSprint); // Lấy tất cả sprint được tạo bởi người dùng
sprintRouter.delete('/delete/:id', authVerify, sprintController.deleteSprint); // Xóa sprint (chỉ người tạo mới được phép xóa)


export default sprintRouter;
