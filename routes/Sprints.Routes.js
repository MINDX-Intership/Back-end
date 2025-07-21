import express from 'express';
import sprintController from '../controllers/Sprints.Controller.js';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const sprintRouter = express.Router();

// sprintRouter.get('/my-schedule', authVerify, sprintController.getMySchedule);     // Xem lịch làm việc
// sprintRouter.post('/add', authVerify, sprintController.addSchedule);             // Thêm lịch làm việc
sprintRouter.post('/add', authVerify, requireUserAdmin, sprintController.createSprint);             // Thêm sprint
sprintRouter.get('/all', authVerify, sprintController.getSprint);          //


export default sprintRouter;
