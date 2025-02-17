import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../db";
import * as crypto from "crypto";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post(
  "/google-auth",
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (req.method === "OPTIONS") {
        return res.status(200).end();
      }

      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ msg: "No token provided" });
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ msg: "Invalid token" });
      }

      let user = await User.findOne({ email: payload.email });
      if (!user) {
        user = new User({
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          password: crypto.randomBytes(32).toString("hex"),
        });
        await user.save();
      }

      const jwtToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
        },
        process.env.JWT_SECRET as string
      );

      return res.json({
        token: jwtToken,
        firstName: user.firstName,
        email: user.email,
        userId: user._id,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({ msg: "Authentication failed" });
    }
  }
);

export default router;
