import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./routes/index";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://cognito-theta.vercel.app",
  "https://cognito-86vu.onrender.com",
  "https://play.google.com",
  "https://cognito.shreyanshshukla.me",
  "https://cognito-qq9p.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("The CORS policy does not allow access from this origin."),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("Server is alive");
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
