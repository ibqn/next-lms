import { z } from "zod"
import { courseTable, insertCourseSchema } from "../drizzle/schema/course"
import { createUpdateSchema } from "drizzle-zod"

export const createCourseSchema = insertCourseSchema.pick({
  title: true,
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>

export const updateCourseSchema = createUpdateSchema(courseTable)
  .partial()
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })

export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>
