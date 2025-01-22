"use client"

import { useForm } from "react-hook-form"
import { CardWrapper } from "./card-wrapper"
import { type SigninSchema, signinSchema } from "database/src/validators/signin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FormError } from "./form-error"
import { FormSuccess } from "./form-success"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postSignin } from "@/api/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { AxiosError } from "axios"
import { toast } from "@/components/ui/use-toast"
import { ErrorResponse, SuccessResponse } from "database/src/types"

export const SignInForm = () => {
  const [response, setResponse] = useState<SuccessResponse | ErrorResponse | null>(null)

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/"

  const queryClient = useQueryClient()

  const { mutate: signin } = useMutation({
    mutationFn: postSignin,
    onSuccess: async () => {
      console.log("Signin success")
      setResponse({ success: true, message: "Welcome back" })
      toast({ title: "Sign in success", description: "Welcome back", variant: "green" })
      await queryClient.invalidateQueries({ queryKey: ["user"] })
      router.push(redirect)
    },
    onError: (error) => {
      let message = "Signin failed"

      if (error instanceof AxiosError) {
        const response = error.response?.data as ErrorResponse
        message = response.error
      }
      setResponse({ success: false, error: message })
      toast({ title: "Sign in failed", description: message, variant: "destructive" })
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data)
    signin(data)
  })

  const isDisabled = form.formState.isSubmitting

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
                      type="text"
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

          {response?.success && <FormSuccess message={response.message} />}
          {response?.success === false && <FormError message={response.error} />}

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
