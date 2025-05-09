import express, { Request, Response } from "express";
import { userMiddleware } from "../middlewares/authMiddleware";
import { User } from "../db";

const router = express.Router();

router.get(
  "/",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await User.findById(req.user?.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { firstName, lastName, email, bio } = req.body;
      const user = await User.findById(req.user?.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (bio) user.bio = bio;

      await user.save();

      const updatedUser = await User.findById(user.id).select("-password");
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/password",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user?.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // For regular email/password users
      if (user.password) {
        if (currentPassword !== user.password) {
          return res
            .status(400)
            .json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();
        return res.json({ message: "Password updated successfully" });
      } else {
        // For Google-authenticated users
        return res.status(400).json({
          message:
            "Password update not available for Google-authenticated accounts",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
