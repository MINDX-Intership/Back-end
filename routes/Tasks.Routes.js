import express from 'express';
import taskController from '../controllers/Task.Controllers.js';
import { authVerify, requireUserLeader } from '../middlewares/Auth.Middlewares.js';

const taskRouter = express.Router();

// Task CRUD operations
taskRouter.post('/create', authVerify, requireUserLeader, taskController.createTask);          // Tạo task mới
taskRouter.get('/all', authVerify, taskController.getAllTasks);                                // Lấy tất cả task (Admin)
taskRouter.get('/my-tasks', authVerify, taskController.getMyTasks);                            // Lấy task cá nhân
taskRouter.get('/sprint/:sprintId', authVerify, taskController.getTasksBySprint);              // Lấy task theo sprint
taskRouter.post('/sprint/:sprintId/add', authVerify, requireUserLeader, taskController.addTaskToSprint); // Thêm task vào sprint
taskRouter.get('/:taskId', authVerify, taskController.getTaskById);                            // Lấy task theo ID
taskRouter.put('/:taskId/update', authVerify, taskController.updateTask);                      // Cập nhật task
taskRouter.delete('/:taskId/delete', authVerify, requireUserLeader, taskController.deleteTask); // Xóa task

// Task actions
taskRouter.post('/:taskId/submit', authVerify, taskController.submitTaskInfo);                 // Gửi thông tin task

export default taskRouter;