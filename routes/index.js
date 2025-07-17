import accountRouter from "./Accounts.Routes.js";
import userRouter from "./Users.Routes.js";
import { Router } from "express";

const rootRouter = Router();

rootRouter.use('/accounts', accountRouter);
rootRouter.use('/users', userRouter);

export default rootRouter;