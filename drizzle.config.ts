import type { Config } from "drizzle-kit"
import { env } from "@/env/server"

export default {
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
   url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config
