import { Router } from "express";

import authRouter from "./auth";
import summaryRouter from "./summary";

const router = Router();

router.use("/auth", authRouter);
router.use("/summary", summaryRouter);

export default router;
