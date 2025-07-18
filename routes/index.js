import accountRouter from "./Accounts.Routes.js";
import userRouter from "./Users.Routes.js";
// import taskRouter from "./task.Routes.js";
// import sprintRouter from "./Sprints.Routes.js";
import { Router } from "express";

const rootRouter = Router();

rootRouter.use('/accounts', accountRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/tasks', taskRouter);       // Quản lý timeline task cá nhân
rootRouter.use('/sprints', sprintRouter);   // Quản lý lịch làm việc cá nhân

export default rootRouter;
