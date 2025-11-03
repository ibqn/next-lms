import { createInsertSchema } from "drizzle-zod"
import { sessionTable } from "../drizzle/schema/auth"
import type z from "zod"

const createSessionSchema = createInsertSchema(sessionTable).omit({
  createdAt: true,
  updatedAt: true,
})

export type CreateSessionSchema = z.infer<typeof createSessionSchema>
