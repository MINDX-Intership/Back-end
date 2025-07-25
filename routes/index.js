import { Router } from 'express';
import accountRouter from './Accounts.Routes.js';
import userRouter from './Users.Routes.js';
import sprintRouter from './Sprints.Routes.js';
import taskRouter from './Tasks.Routes.js';
import notificationRouter from './Notifications.Routes.js';
import documentRouter from './Documents.Routes.js';
import projectRouter from './Projects.Routes.js';
import supportRequestRouter from './SupportRequests.Routes.js';
import googleCalendarRouter from './GoogleCalendar.Routes.js';  
import jobPositionRouter from './JobPositions.Routes.js';
import departRouter from './Departs.Routes.js';
import adminTimelineTasksRouter from './AdminTimelineTasks.Routes.js';
import adminAccessControlRouter from './AdminAccessControl.Routes.js';
import reportRouter from './Report.Routes.js';
import timelineRouter from './Timeline.Routes.js';
import personalManagementRouter from './PersonalManagement.Routes.js';

const router = Router();

router.use('/account', accountRouter);
router.use('/user', userRouter);
router.use('/sprint', sprintRouter);
router.use('/task', taskRouter);
router.use('/notifications', notificationRouter);
router.use('/documents', documentRouter);
router.use('/projects', projectRouter);
router.use('/support', supportRequestRouter);      
router.use('/calendar', googleCalendarRouter);       
router.use('/job-position', jobPositionRouter);
router.use('/depart', departRouter);
router.use('/admin/timeline-tasks', adminTimelineTasksRouter);
router.use('/admin/access-control', adminAccessControlRouter);
router.use('/report', reportRouter);
router.use('/timeline', timelineRouter);
router.use('/personal-management', personalManagementRouter);

export default router;
