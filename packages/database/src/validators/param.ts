import { z } from "zod"

export const paramIdSchema = z.object({
  id: z.uuid().nonempty(),
})

export type ParamIdSchema = z.infer<typeof paramIdSchema>
