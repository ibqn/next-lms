import { z } from "zod"

export const sortedByValues = ["title", "recent"] as const
export const sortedBySchema = z.enum(sortedByValues)
export type SortedBySchema = z.infer<typeof sortedBySchema>

export const orderSchema = z.enum(["asc", "desc"])
export type OrderSchema = z.infer<typeof orderSchema>

export const paginationSchema = z.object({
  limit: z.coerce.number().default(10),
  page: z.coerce.number().default(1),
  sortedBy: sortedBySchema.default("recent"),
  order: orderSchema.default("desc"),
})

export type PaginationSchema = z.infer<typeof paginationSchema>
