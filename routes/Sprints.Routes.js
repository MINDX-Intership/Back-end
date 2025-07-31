import express from 'express';
import sprintController from '../controllers/Sprints.Controller.js';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const sprintRouter = express.Router();

sprintRouter.post('/add', authVerify, requireUserAdmin, sprintController.createSprint);             // Thêm sprint
sprintRouter.get('/all', authVerify, sprintController.getSprint);          // Lấy danh sách sprint
sprintRouter.get('/:id', authVerify, requireUserAdmin, sprintController.getSprintById); // Lấy thông tin sprint theo ID
// sprintRouter.get('/:userId', authVerify, sprintController.getSprintsByStaffId); // Lấy danh sách sprint theo staff ID
sprintRouter.put('/:id', authVerify, requireUserAdmin, sprintController.updateSprint); // Cập nhật sprint
sprintRouter.put('/complete/:id', authVerify, requireUserAdmin, sprintController.completeSprint); // Hoàn thành sprint
sprintRouter.delete('/:id', authVerify, requireUserAdmin, sprintController.deleteSprint); // Xóa sprint

export default sprintRouter;
