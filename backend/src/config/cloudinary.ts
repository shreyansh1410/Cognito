// config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "content-uploads", // This is the folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "webm", "mp3", "wav"],
    resource_type: "auto", // auto-detect whether it's video/image/raw
  } as any,
});

export { cloudinary, storage };
