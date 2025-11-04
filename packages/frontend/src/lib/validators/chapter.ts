import { z } from "zod"

export const titleSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
})

export const descriptionSchema = z.object({
  description: z.string(),
})

export type TitleSchema = z.infer<typeof titleSchema>
export type DescriptionSchema = z.infer<typeof descriptionSchema>
