import { z } from "zod"

export const titleSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
})

export const descriptionSchema = z.object({
  description: z.string(),
})

export const accessSchema = z.object({
  isFree: z.boolean(),
})

export const videoSchema = z.object({
  videoUrl: z.string(),
})

export type TitleSchema = z.infer<typeof titleSchema>
export type DescriptionSchema = z.infer<typeof descriptionSchema>
export type AccessSchema = z.infer<typeof accessSchema>
export type VideoSchema = z.infer<typeof videoSchema>
