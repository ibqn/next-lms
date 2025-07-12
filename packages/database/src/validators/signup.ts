import { z } from "zod"
import { signinSchema } from "./signin"

export const signupSchema = signinSchema
  .extend({
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  })

export type SignupSchema = z.infer<typeof signupSchema>
