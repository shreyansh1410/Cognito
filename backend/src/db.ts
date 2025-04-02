import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    bio: { type: String, default: "" },
  },
  {
    autoIndex: true,
  }
);

UserSchema.on("index", function (error) {
  if (error) {
    console.error("User Schema Index Error:", error);
  }
});

const TagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

const contentTypes = ["image", "video", "article", "audio", "tweet", "link"];
const ContentSchema = new mongoose.Schema(
  {
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

ContentSchema.index({ link: 1, userId: 1 }, { unique: true });

const LinkSchema = new mongoose.Schema({
  hash: { type: String, requires: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  isPublic: Boolean,
});

const User = mongoose.model("User", UserSchema);
const Tag = mongoose.model("Tag", TagSchema);
const Content = mongoose.model("Content", ContentSchema);
const Link = mongoose.model("Link", LinkSchema);

export { User, Tag, Content, Link };
