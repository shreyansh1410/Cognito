import express from "express";
import { Request, Response } from "../index";
import userRouter from "./user";
import contentRouter from "./content";

const router = express.Router();
// Define user-related routes

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World from home");
});

router.use("/user", userRouter);
router.use("/content", contentRouter);

export { router };
