import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation:
    process.env.NODE_ENV !== "production" ||
    process.env.SKIP_ENV_VALIDATION === "true",

  server: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    NEXT_PUBLIC_APPWRITE_APP_URL: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_APPWRITE_API_KEY: z.string(),
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string(),
    NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID: z.string(),
  },

  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_APPWRITE_APP_URL: z.string(),
    NEXT_PUBLIC_APPWRITE_API_KEY: z.string(),
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string(),
    NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID: z.string(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_APPWRITE_APP_URL: process.env.NEXT_PUBLIC_APPWRITE_APP_URL,
    NEXT_PUBLIC_APPWRITE_API_KEY: process.env.NEXT_PUBLIC_APPWRITE_API_KEY,
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
  },
});