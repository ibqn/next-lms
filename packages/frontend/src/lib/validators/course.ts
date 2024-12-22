import { z } from "zod"

export const courseSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
})

export const updateCourseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

export const titleSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
})

export const descriptionSchema = z.object({
  description: z.string().default(""),
})

export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>
export type CourseSchema = z.infer<typeof courseSchema>

export type TitleSchema = z.infer<typeof titleSchema>
export type DescriptionSchema = z.infer<typeof descriptionSchema>
