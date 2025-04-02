import express from "express";
import { Request, Response } from "../../index";
import userRouter from "./user";
import contentRouter from "./content";
import brainRouter from "./brain";
import authRouter from "./auth";
import uploadRouter from "./upload";
import profileRouter from "./profile";
import aiRouter from "./ai";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World from home");
});

router.use("/user", userRouter);
router.use("/content", contentRouter);
router.use("/brain", brainRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/profile", profileRouter);
router.use("/ai", aiRouter);

export { router };
