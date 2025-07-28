import { Router } from 'express';
import { authVerify } from '../middlewares/Auth.Middlewares.js';
import projectController from '../controllers/Projects.Controller.js';

const router = Router();



export default router;
