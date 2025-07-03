import { createInsertSchema } from "drizzle-zod"
import { attachmentTable } from "../drizzle/schema/attachment"
import { z } from "zod/v4"

export const insertAttachmentSchema = createInsertSchema(attachmentTable)

export const createAttachmentSchema = z.array(
  insertAttachmentSchema
    .pick({
      id: true,
      name: true,
      courseId: true,
      url: true,
    })
    .partial({
      id: true,
    })
)

export type CreateAttachmentSchema = z.infer<typeof createAttachmentSchema>
