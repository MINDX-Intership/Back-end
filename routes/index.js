import accountRouter from "./Accounts.Routes";
import userRouter from "./Users.Routes";
import { Router } from "express";

const rootRouter = Router();

rootRouter.use('/accounts', accountRouter);
rootRouter.use('/users', userRouter);

export default rootRouter;