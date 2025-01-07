// Global Types and Interfaces
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      username: string;
    };
  }
}

// Custom Module Declarations
declare module "some-unsupported-library" {
  export function someFunction(): void;
}

// Common Type Definitions
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
  username: string;
  password: string;
  sharedLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Environment Variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      JWT_SECRET: string;
    }
  }
}
