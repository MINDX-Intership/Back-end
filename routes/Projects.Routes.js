import express from 'express';
import { authVerify } from '../middlewares/Auth.Middlewares.js';
import {
  joinProject,
  getMyProjectProgress,
  sendProjectReport
} from '../controllers/Projects.Controller.js';

const router = express.Router();

router.post('/join/:projectId', authVerify, joinProject);
router.get('/my-progress', authVerify, getMyProjectProgress);
router.post('/:projectId/report', authVerify, sendProjectReport);

export default router;
