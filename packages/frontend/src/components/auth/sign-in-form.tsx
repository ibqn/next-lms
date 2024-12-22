"use client"

import { useForm } from "react-hook-form"
import { CardWrapper } from "./card-wrapper"
import { type SigninSchema, signinSchema } from "database/src/validators/signin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import Link from "next/link"

export const SignInForm = () => {
  const [isDisabled, setDisabled] = useState(false)
  const [response, setResponse] = useState<null>(null)

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data)
  })

  return (
    <CardWrapper headerLabel="Welcome back" backButtonLabel="Don't have an account?" backButtonHref="/sign-up">
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
                    <Input
                      {...field}
                      type="email"
                      autoComplete="username"
                      placeholder="Username"
                      disabled={isDisabled}
                    />
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
                    <Input
                      {...field}
                      type="password"
                      autoComplete="current-password"
                      placeholder="******"
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* {responseType === "success" && <FormSuccess message={responseMessage} />} */}
          {/* {(responseType === "error" || urlError) && <FormError message={responseMessage || urlError} />} */}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            Sign In
          </Button>
        </form>
      </Form>

      <Button size="sm" variant="link" asChild className="px-0 font-normal">
        <Link href="/password-reset">Forgot password?</Link>
      </Button>
    </CardWrapper>
  )
}
