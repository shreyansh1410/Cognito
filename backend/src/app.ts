import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import { router } from "./routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
