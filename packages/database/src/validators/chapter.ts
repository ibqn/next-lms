import { z } from "zod"
import { chapterTable } from "../drizzle/schema/chapter"
import { createInsertSchema } from "drizzle-zod"

export const insertChapterSchema = createInsertSchema(chapterTable, {
  courseId: z.string().uuid(),
  title: z
    .string()
    .min(3, { message: "Title should have at least 3 characters." }),
})

export const createChapterSchema = insertChapterSchema.pick({
  title: true,
  courseId: true,
})

export type CreateChapterSchema = z.infer<typeof createChapterSchema>
