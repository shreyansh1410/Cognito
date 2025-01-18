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
  email: zod.string().email().nonempty("Email is required"),
  password: zod
    .string()
    .min(8)
    .nonempty("Password of atleast 8 characters is required"),
  firstName: zod.string().nonempty("First Name is required"),
  lastName: zod.string(),
});

const signinBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) return res.status(411).json({ msg: "Invalid input" });
    const { email, password, firstName, lastName } = req.body;

    console.log("Received signup data:", { email, firstName, lastName }); // Log incoming data

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ email, password, firstName, lastName });
    console.log("Created user object:", user); // Log user object

    await user.save();
    console.log("User saved successfully"); // Log successful save

    const hash = generateHash();
    const link = new Link({
      hash,
      userId: user._id,
    });

    console.log("Created link object:", link); // Log link object
    await link.save();
    console.log("Link saved successfully"); // Log successful save

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    const token = jwt.sign(
      { id: user._id, name: user.email, firstName: user.firstName },
      JWT_SECRET
    );

    return res.json({
      token,
      msg: "User created successfully proceed to Login",
      brainLink: `${baseUrl}/brain/${hash}`,
      hash,
    });
  } catch (err: any) {
    console.error("Signup error:", err); // Log full error
    return res.status(500).json({
      msg: "Error creating user",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const { success } = signinBody.safeParse(req.body);
  if (!success) return res.status(411).json({ msg: "Invalid input" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(411).json({ msg: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.email, firstName: user.firstName },
      JWT_SECRET
    );

    return res.json({ token, firstName: user.firstName });
  } catch (err: any) {
    return res.json({ msg: "Error signing in", error: err.message });
  }
});

export default router;
