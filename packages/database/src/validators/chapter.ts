import { z } from "zod"
import { chapterTable } from "../drizzle/schema/chapter"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const insertChapterSchema = createInsertSchema(chapterTable, {
  courseId: z.uuid(),
  title: z.string().min(3, { message: "Title should have at least 3 characters." }),
})

export const createChapterSchema = insertChapterSchema.pick({
  title: true,
  courseId: true,
})

export type CreateChapterSchema = z.infer<typeof createChapterSchema>

export const reorderChapterSchema = z.object({
  reorderList: z.array(
    z.object({
      id: z.uuid(),
      position: z.number().positive(),
    })
  ),
})

export type ReorderChapterSchema = z.infer<typeof reorderChapterSchema>

export const updateChapterSchema = createUpdateSchema(chapterTable).partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type UpdateChapterSchema = z.infer<typeof updateChapterSchema>

export const progressChapterSchema = z.object({
  isCompleted: z.boolean(),
})

export type ProgressChapterSchema = z.infer<typeof progressChapterSchema>
