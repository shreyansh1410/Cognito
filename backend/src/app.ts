import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes/index";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT;

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://cognito-theta.vercel.app",
    "https://cognito-86vu.onrender.com",
    "https://play.google.com",
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/v1", router);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Something went wrong!" });
  }
);

console.log(process.env.PORT);
console.log(`mongouri: ${process.env.MONGO_URI}`);
console.log(`jwtsecret: ${process.env.JWT_SECRET}`);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
