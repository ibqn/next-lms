import { z } from "zod"

export const titleSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
})

export const descriptionSchema = z.object({
  description: z.string().default(""),
})

export const imageSchema = z.object({
  imageUrl: z.string().default(""),
})

export const categorySchema = z.object({
  categoryId: z.string().uuid().nullable(),
})

export const priceSchema = z.object({
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." })
    .or(z.literal("").transform(() => null)),
})

export const attachmentSchema = z.object({
  attachments: z.array(
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1, { message: "Name is required." }),
      url: z.string().min(1, { message: "URL is required." }),
    })
  ),
})

export type TitleSchema = z.infer<typeof titleSchema>
export type DescriptionSchema = z.infer<typeof descriptionSchema>
export type ImageSchema = z.infer<typeof imageSchema>
export type CategorySchema = z.infer<typeof categorySchema>
export type PriceSchema = z.infer<typeof priceSchema>
export type AttachmentSchema = z.infer<typeof attachmentSchema>
