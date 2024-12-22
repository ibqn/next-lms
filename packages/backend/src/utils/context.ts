import type { Env } from "hono"
import type { User, Session } from "database/src/drizzle/schema/auth"

export interface Context extends Env {
  Variables: {
    user: User | null
    session: Session | null
  }
}
