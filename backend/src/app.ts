import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes/index";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/v1", router);

console.log(process.env.PORT);
console.log(`mongouri: ${process.env.MONGO_URI}`);
console.log(`jwtsecret: ${process.env.JWT_SECRET}`);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
