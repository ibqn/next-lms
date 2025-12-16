import { z } from "zod"

export const courseQuerySchema = z.object({
  searchTitle: z.string().optional(),
  category: z.string().optional(),
})

export type CourseQuerySchema = z.infer<typeof courseQuerySchema>
