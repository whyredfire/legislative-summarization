import { Router } from "express";

import authRouter from "./auth";
import summaryRouter from "./summary";
import userRouter from "./user";

const router = Router();

router.use("/auth", authRouter);
router.use("/summary", summaryRouter);
router.use("/user", userRouter);

export default router;
