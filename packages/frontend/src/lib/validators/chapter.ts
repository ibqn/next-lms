import { z } from "zod"

export const titleSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
})

export type TitleSchema = z.infer<typeof titleSchema>
