// routes/upload.ts
import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary";
import { userMiddleware } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

const router = express.Router();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/",
  userMiddleware,
  upload.single("file"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Cloudinary automatically uploads the file and req.file contains the result including the URL
      res.json({
        url: req.file.path,
        public_id: req.file.filename,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// Optional:delete route
// router.delete("/:public_id", userMiddleware, async (req, res) => {
//   try {
//     const { public_id } = req.params;
//     await cloudinary.uploader.destroy(public_id);
//     res.json({ message: "File deleted successfully" });
//   } catch (error) {
//     console.error("Delete error:", error);
//     res.status(500).json({ error: "Failed to delete file" });
//   }
// });

export default router;
