import express from "express";
import { Request, Response } from "../../index";
import dotenv from "dotenv";
import { userMiddleware } from "../middlewares/authMiddleware";
import { Content, Link } from "../db";
import { generateHash } from "./user";

dotenv.config();

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  res.send("Hello");
});

const baseUrl =
  `${process.env.BASE_URL}/api/v1` || "http://localhost:3000/api/v1";

const frontendUrl =
  `${process.env.FRONTEND_URL}/api/v1` ||
  "http://localhost:5173" ||
  "https://cognito.shreyanshshukla.me/api/v1";

router.post(
  "/share",
  userMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { isShare } = req.body;
      if (!isShare) {
        return res.status(400).json({
          msg: "isShare is required",
        });
      }

      if (!req.user?.id) {
        return res.status(401).json({
          msg: "Unauthorized",
        });
      }

      let link = await Link.findOne({
        userId: req.user?.id,
      });

      if (!link) {
        const hash = generateHash();
        link = new Link({
          hash,
          userId: req.user.id,
          isPublic: true,
        });
        await link.save();
      }
      if (!link.hash) {
        // If somehow hash is missing, generate a new one
        link.hash = generateHash();
        await link.save();
      }

      return res.status(200).json({
        msg: "Brain share link retrieved successfully",
        shareLink: `${frontendUrl}/brain/${link.hash}`,
        hash: link.hash,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        msg: "unable to fetch share link",
        error: err,
      });
    }
  }
);

router.get("/:shareLink", async (req: Request, res: Response): Promise<any> => {
  // if (!req.user?.id)
  //   return res.status(404).json({
  //     msg: "Please log in to see the brain",
  //   });
  try {
    const { shareLink } = req.params;
    const link = await Link.findOne({
      hash: shareLink,
    });

    if (!link) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    const userId = link.userId;
    const contents = await Content.find({
      userId: link.userId,
    }).populate("tags", "title");

    if (!contents) {
      return res.status(500).json({
        msg: "User does not have any content",
      });
    }

    return res.status(200).json({
      contents: contents.map((content) => ({
        id: content._id.toString(),
        type: content.type,
        title: content.title,
        link: content.link,
        tags: content.tags.map((tag: any) => tag.title),
        createdAt: content.createdAt,
      })),
      userId: userId,
    });
  } catch (err) {
    console.error(err);
  }
});

export default router;
