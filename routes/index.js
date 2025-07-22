import express from 'express';
import accountRouter from './Accounts.Routes.js';
import userRouter from './Users.Routes.js';
import sprintRouter from './Sprints.Routes.js';
import taskRouter from './Tasks.Routes.js';
import notificationRouter from './Notifications.Routes.js'; 
import documentRouter from './Documents.Routes.js';          
const router = express.Router();

router.use('/account', accountRouter);
router.use('/user', userRouter);
router.use('/sprint', sprintRouter);
router.use('/task', taskRouter);
router.use('/notifications', notificationRouter); 
router.use('/documents', documentRouter);         

export default router;
