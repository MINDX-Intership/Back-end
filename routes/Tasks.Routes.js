import express from 'express';
import taskController from '../controllers/Task.Controllers.js';
import { authVerify, requireUserLeader } from '../middlewares/Auth.Middlewares.js';

const taskRouter = express.Router();

taskRouter.post('/create', authVerify, requireUserLeader, taskController.createTask); // Tạo task mới
taskRouter.get('/all', authVerify, taskController.getAllTasks); // Lấy tất
taskRouter.get('/my-tasks', authVerify, taskController.getTasks);                              // Lấy task đã giao
taskRouter.post('/:taskId/submit', authVerify, taskController.submitTaskInfo);                  // Gửi thông tin task
taskRouter.post('/:taskId/comment', authVerify, taskController.commentOnTask);                  // Bình luận task
taskRouter.post('/add', authVerify, requireUserLeader, taskController.addTaskToSprint);                   // Admin thêm task

export default taskRouter;
