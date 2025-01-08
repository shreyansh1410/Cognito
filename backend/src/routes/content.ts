import express from "express";
import { Request, Response } from "../index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import zod from "zod";
import { User, Content, Tag, Link } from "../utils/db";
import { userMiddleware } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "";

const createContentBody = zod.object({
  type: zod.string().nonempty(),
  link: zod.string().url(),
  title: zod.string().nonempty(),
  tags: zod.array(zod.string().optional()),
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.post(
  "/create",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    const parseResult = createContentBody.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ msg: "Invalid input", error: parseResult.error.errors });
    }
    const { type, link, title, tags } = parseResult.data;

    try {
      if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      // Check if the link already exists in the database
      let existingLink = await Link.findOne({ link }); // Look for the link in the database
      if (!existingLink) {
        // If the link doesn't exist, create a new one
        existingLink = new Link({
          link,
          userId: req.user.id,
        });
        await existingLink.save(); // Save the new link
      }
      const tagIds: mongoose.Types.ObjectId[] = [];
      if (tags) {
        for (const tagName of tags) {
          let tag = await Tag.findOne({ name: tagName });
          if (!tag) {
            // Create a new tag if it doesn't exist
            tag = new Tag({ title: tagName });
            await tag.save();
          }
          tagIds.push(tag._id);
        }
      }

      const content = new Content({
        type,
        link,
        title,
        tags: tagIds,
        userId: req.user.id, // Associate content with the authenticated user
      });

      await content.save();

      return res.status(200).json({
        msg: "Content created successfully",
        content: {
          id: content._id,
          type: content.type,
          title: content.title,
          link: content.link,
          tags: content.tags || [],
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        // If the error is an instance of Error, you can access its properties
        console.error(err.message); // You can also use `err.stack` for stack trace if needed
        return res
          .status(500)
          .json({ msg: "Error creating content", error: err.message });
      } else {
        // If it's not an instance of Error, return a generic message
        console.error(err);
        return res.status(500).json({
          msg: "Error creating content",
          error: "An unexpected error occurred",
        });
      }
    }
  }
);

router.get(
  "/",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const content = await Content.find({}, "_id type title tags userId");
      return res.status(200).json({
        content: content.map((single) => ({
          id: single._id,
          type: single.type,
          title: single.title,
          tags: single.tags,
          link: single.link,
        })),
      });
    } catch {
      return res.status(500).json({ msg: "Error fetching users" });
    }
  }
);

export default router;
