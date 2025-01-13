import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import zod from "zod";
import { Link, User } from "../db";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

export function generateHash(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hash = "";
  for (let i = 0; i < 10; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

const signupBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) return res.status(411).json({ msg: "Invalid input" });
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ username, password });

    await user.save();

    const hash = generateHash();
    console.log("Generated hash:", hash); // Debug log

    const link = new Link({
      hash,
      userId: user._id,
      isPublic: true,
    });
    await link.save();

    console.log("Saved link:", link); // Debug log

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    return res.json({
      msg: "User created successfully proceed to Login",
      brainLink: `${baseUrl}/brain/${hash}`,
      hash, // Adding hash for debugging
    });
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
      expiresIn: "12h",
    });

    return res.json({ token });
  } catch (err: any) {
    return res.json({ msg: "Error signing in", error: err.message });
  }
});

export default router;
