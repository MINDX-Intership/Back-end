import express from 'express';
import {
  submitTaskInfo,
  commentOnTask,
  addTaskToSprint,
  getMyTasks
} from '../controllers/Task.Controllers.js';
import { authVerify, requireUserLeader } from '../middlewares/Auth.Middlewares.js';

const taskRouter = express.Router();

taskRouter.get('/my-tasks', authVerify, getMyTasks);                              // Lấy task đã giao
taskRouter.post('/:taskId/submit', authVerify, submitTaskInfo);                  // Gửi thông tin task
taskRouter.post('/:taskId/comment', authVerify, commentOnTask);                  // Bình luận task
taskRouter.post('/add', authVerify, requireUserLeader, addTaskToSprint);                   // Admin thêm task

export default taskRouter;
