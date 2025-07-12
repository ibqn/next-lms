import type { Config } from "drizzle-kit"
import { env } from "src/env"

export default {
  schema: "src/drizzle/schema",
  dialect: "postgresql",
  out: "src/drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config
