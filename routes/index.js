import express from 'express';
import accountRouter from './Accounts.Routes.js';
import userRouter from './Users.Routes.js';
import sprintRouter from './Sprints.Routes.js';
import taskRouter from './Tasks.Routes.js';
import jobPositionRouter from './JobPositions.Routes.js';
import departRouter from './Departs.Routes.js';


const router = express.Router();

router.use('/account', accountRouter);
router.use('/user', userRouter);
router.use('/sprint', sprintRouter);
router.use('/task', taskRouter);
router.use('/job-position', jobPositionRouter);
router.use('/depart', departRouter);

export default router;
