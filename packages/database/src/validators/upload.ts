import { insertUploadSchema } from "../drizzle/schema/upload"
import { z } from "zod"

export const createUploadSchema = insertUploadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
})

export type CreateUploadSchema = z.infer<typeof createUploadSchema>
