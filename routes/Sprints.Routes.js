import express from 'express';
import { getMySchedule, addSchedule } from '../controllers/Sprint.Controllers.js';
import { authVerify } from '../middlewares/Auth.Middlewares.js';

const sprintRouter = express.Router();

sprintRouter.get('/my-schedule', authVerify, getMySchedule);     // Xem lịch làm việc
sprintRouter.post('/add', authVerify, addSchedule);              // Thêm lịch làm việc

export default sprintRouter;
