import { z } from "zod"

export const courseSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
})

export type CourseSchema = z.infer<typeof courseSchema>
