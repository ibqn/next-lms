import type { Env } from "hono"
import type { User, Session } from "database/src/drizzle/schema/auth"

export interface ExtEnv extends Env {
  Variables: {
    user: User | null
    session: Session | null
  }
}
