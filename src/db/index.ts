import { drizzle } from "drizzle-orm/postgres-js"
import { env } from "@/env/server"
import postgres from "postgres"
import * as schema from "./schema"

const queryClient = postgres(env.DATABASE_URL)
export const db = drizzle(queryClient, { schema })
