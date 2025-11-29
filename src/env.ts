import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    GEMINI_API_KEY: z.string(),
  },
  client: {

  },

  // only for client env variables
  experimental__runtimeEnv: {

  }
});