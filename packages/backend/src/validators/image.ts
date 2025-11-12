import { z } from "zod"

export const imageQuerySchema = z.object({
  w: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  q: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  format: z.enum(["webp", "jpeg", "jpg", "png", "avif"]).optional()
})

export type ImageQuery = z.infer<typeof imageQuerySchema>
