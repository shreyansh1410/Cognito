import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "../../index";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  return new Promise<void>((resolve, reject) => {
    try {
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "UNAUTHORIZED" });
      }
      const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer '
      if (!token)
        return res
          .status(401)
          .json({ msg: "Access denied, no token provided" });
      const decoded = jwt.verify(token, JWT_SECRET!);
      // console.log(decoded);
      req.user = decoded as { id: string; username: string }; // Attach the user info to the request object
      next(); // Proceed to the next middleware or route handler
      resolve();
    } catch (err) {
      reject(err);
      return res.status(401).json({ msg: "Invalid token" });
    }
  });
};
