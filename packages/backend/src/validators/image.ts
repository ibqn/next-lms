import { z } from "zod"

export const imageQuerySchema = z.object({
  w: z.coerce.number().positive().optional(),
  q: z.coerce.number().min(1).max(100).optional(),
  format: z.enum(["webp", "jpeg", "jpg", "png", "avif"]).optional()
})

export type ImageQuery = z.infer<typeof imageQuerySchema>
