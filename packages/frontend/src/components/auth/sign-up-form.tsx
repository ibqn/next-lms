"use client"

import { useForm } from "react-hook-form"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { type SignupSchema, signupSchema } from "database/src/validators/signup"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"

export const SignUpForm = () => {
  const form = useForm<SignupSchema>({
    defaultValues: {
      username: "",
      password: "",
      confirm: "",
    },
    resolver: zodResolver(signupSchema),
  })

  const [isDisabled, setDisabled] = useState(false)
  const [response, setResponse] = useState<null>(null)

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data)
  })

  return (
    <CardWrapper headerLabel="Create an account" backButtonLabel="Already have an account?" backButtonHref="/sign-in">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Username" disabled={isDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" disabled={isDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" disabled={isDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {response?.type === "success" && <FormSuccess message={response.message} />}

          {response?.type === "error" && <FormError message={response.message} />}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
