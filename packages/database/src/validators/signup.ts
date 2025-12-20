import { z } from "zod"
import { signinSchema } from "./signin"

export const signupSchema = signinSchema.extend({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
})

export type SignupSchema = z.infer<typeof signupSchema>

export const signupFormSchema = signupSchema
  .extend({ confirm: z.string() })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  })

export type SignupFormSchema = z.infer<typeof signupFormSchema>
