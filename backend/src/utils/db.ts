import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

//user schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//tag schema
const TagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

//content schema
const contentTypes = ["image", "video", "article", "audio"]; // Extend as needed
const ContentSchema = new mongoose.Schema({
  link: { type: String, required: true, unique: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  userId: { type: Types.ObjectId, ref: "User", required: true },
});

//link schema
const LinkSchema = new mongoose.Schema({
  hash: { type: String, requires: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
});

const User = mongoose.model("User", UserSchema);
const Tag = mongoose.model("Tag", TagSchema);
const Content = mongoose.model("Content", ContentSchema);
const Link = mongoose.model("Link", LinkSchema);

export { User, Tag, Content, Link };
