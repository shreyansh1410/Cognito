import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";

interface Content {
  id: string;
  type: "document" | "tweet" | "youtube" | "link";
  link: string;
  title: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  sharedLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string }; // Make user optional and define its type
    }
    interface Response {
      user?: { id: string; email: string }; // Make user optional and define its type
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
    }
  }
}

export type Request = ExpressRequest;
export type Response = ExpressResponse;
export type NextFunction = ExpressNextFunction;
