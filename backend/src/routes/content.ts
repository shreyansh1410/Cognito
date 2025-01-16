import express from "express";
import { Request, Response } from "../../index";
import dotenv from "dotenv";
import zod from "zod";
import { User, Content, Tag, Link } from "../db";
import { userMiddleware } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

dotenv.config();

const router = express.Router();

const createContentBody = zod.object({
  type: zod.enum(["image", "video", "article", "audio", "tweet"], {
    errorMap: () => ({
      message:
        "Invalid content type. Allowed types are: image, video, article, audio, tweet",
    }),
  }),
  link: zod.string().url(),
  title: zod.string().nonempty(),
  tags: zod.array(zod.string().optional()),
});

router.post(
  "/create",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    const parseResult = createContentBody.safeParse(req.body);
    if (!parseResult.success) {
      // Get the first error message
      const errorMessage =
        parseResult.error.errors[0]?.message || "Invalid input";
      return res.status(400).json({
        msg: "Validation failed",
        error: errorMessage,
      });
    }
    const { type, link, title, tags } = parseResult.data;

    try {
      if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      // Check if the link already exists
      let existingLink = await Link.findOne({ link });
      if (!existingLink) {
        existingLink = new Link({
          link,
          userId: req.user.id,
        });
        await existingLink.save();
      }

      const tagIds = await Promise.all(
        (tags || []).map(async (tagName) => {
          // Use findOneAndUpdate with upsert to either find or create the tag
          const tag = await Tag.findOneAndUpdate(
            { title: tagName },
            { title: tagName },
            { upsert: true, new: true } //The upsert = true option creates the object if it doesn't exist. defaults to false.
          );
          return tag._id;
        })
      );

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
        console.error(err.message);
        return res
          .status(500)
          .json({ msg: "Error creating content", error: err.message });
      } else {
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ msg: "Unauthorized" });
      }
      const content = await Content.find(
        { userId }, // Filter by the user's ID
        "_id type title tags userId link" // Only select necessary fields
      ).populate("tags", "title"); // Populate tags and only include the 'title' field
      return res.status(200).json({
        content: content.map((single) => ({
          id: single._id,
          type: single.type,
          title: single.title,
          tags: single.tags.map((tag: any) => tag.title), // Extract tag titles
          link: single.link,
        })),
      });
    } catch {
      return res.status(500).json({ msg: "Error fetching users" });
    }
  }
);

router.put(
  "/edit",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    const { contentId, title, type, link, tags } = req.body;

    // Validate input
    if (!contentId || !title || !type || !link) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ msg: "Unauthorized" });
      }

      // Check if the content exists and belongs to the current user
      const content = await Content.findOne({ _id: contentId, userId });
      if (!content) {
        return res.status(404).json({ msg: "Content not found" });
      }

      // Update content fields
      content.title = title;
      content.type = type;
      content.link = link;

      // Update tags
      const tagIds = await Promise.all(
        (tags || []).map(async (tagName: string) => {
          const tag = await Tag.findOneAndUpdate(
            { title: tagName },
            { title: tagName },
            { upsert: true, new: true }
          );
          return tag._id;
        })
      );
      content.tags =
        tagIds as mongoose.Types.DocumentArray<mongoose.Types.ObjectId>;

      // Save the updated content
      await content.save();

      return res.status(200).json({
        msg: "Content updated successfully",
        content: {
          id: content._id,
          type: content.type,
          title: content.title,
          link: content.link,
          tags: content.tags || [],
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: "Error updating content",
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }
);

router.delete(
  "/",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { contentId } = req.body;
      if (!contentId) {
        return res.status(400).json({ message: "Content ID is required" });
      }
      const userId = req.user?.id;
      const content = await Content.findOneAndDelete({
        _id: contentId,
        userId: userId, // Ensure the content belongs to the authenticated user
      });
      if (!content) {
        return res
          .status(404)
          .json({ message: "Content not found or you are not authorized" });
      }
      return res.status(200).json({ message: "Content deleted successfully" });
    } catch (err) {
      console.log(err);
      return res.status(403).json({
        msg: "Delete failed",
        error: err,
      });
    }
  }
);

export default router;
