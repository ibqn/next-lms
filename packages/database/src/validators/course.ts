import type { z } from "zod"
import { insertCourseSchema } from "../drizzle/schema/course"

export const createCourseSchema = insertCourseSchema.pick({
  title: true,
})

export type CreateCourseSchema = z.infer<typeof createCourseSchema>
