import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log(`inside db: ${process.env.MONGO_URI}`);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

//user schema
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
  },
  {
    // This will make Mongoose rebuild indexes on model compilation
    autoIndex: true,
  }
);

UserSchema.on("index", function (error) {
  if (error) {
    console.error("User Schema Index Error:", error);
  }
});

//tag schema
const TagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

//content schema
const contentTypes = ["image", "video", "article", "audio", "tweet"]; // Extend as needed
const ContentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  userId: { type: Types.ObjectId, ref: "User", required: true },
},{
  timestamps: true  // This will add createdAt and updatedAt fields
});

ContentSchema.index({ link: 1, userId: 1 }, { unique: true });

//link schema
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
