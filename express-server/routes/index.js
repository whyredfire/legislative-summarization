import { Router } from "express";

import authRouter from "./auth";
import summaryRouter from "./summary";
import uploadRouter from "./upload";
import userRouter from "./user";

const router = Router();

router.use("/auth", authRouter);
router.use("/summary", summaryRouter);
router.use("/upload", uploadRouter);
router.use("/user", userRouter);

export default router;
