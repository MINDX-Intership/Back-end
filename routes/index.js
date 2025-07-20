import express from 'express';
import accountRouter from './Account.Routes.js';
import userRouter from './User.Routes.js';
import sprintRouter from './Sprint.Routes.js';
import taskRouter from './task.Routes.js';

const router = express.Router();

router.use('/account', accountRouter);
router.use('/user', userRouter);
router.use('/sprint', sprintRouter);
router.use('/task', taskRouter);

export default router;
