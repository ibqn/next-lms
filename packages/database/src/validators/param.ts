import { z } from "zod/v4"

export const paramIdSchema = z.object({
  id: z.uuid().nonempty(),
})

export type ParamIdSchema = z.infer<typeof paramIdSchema>
