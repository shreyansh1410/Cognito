import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import zod from "zod";
import { User } from "../utils/db";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  const { success } = signupBody.safeParse(req.body);
  if (!success) return res.status(411).json({ msg: "Invalid input" });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ username, password });

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ msg: "User created successfully", token });
  } catch (err: any) {
    return res
      .status(500)
      .json({ msg: "Error creating user", error: err.message });
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  const { success } = signinBody.safeParse(req.body);
  if (!success) return res.status(411).json({ msg: "Invalid input" });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(411).json({ msg: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, name: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (err: any) {
    return res.json({ msg: "Error signing in", error: err.message });
  }
});

export default router;
