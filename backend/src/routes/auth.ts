import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../db";
import * as crypto from "crypto";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// New route to handle Google authentication
router.post(
  "/google-auth",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ msg: "No token provided" });
      }

      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ msg: "Invalid token" });
      }

      // Find or create user
      let user = await User.findOne({ email: payload.email });
      if (!user) {
        user = new User({
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          // Set a secure random password or handle passwordless auth
          password: crypto.randomBytes(32).toString("hex"),
        });
        await user.save();
      }

      // Generate JWT
      const jwtToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
        },
        process.env.JWT_SECRET as string,
      );

      return res.json({
        token: jwtToken,
        firstName: user.firstName,
        email: user.email,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({ msg: "Authentication failed" });
    }
  }
);

export default router;
