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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postSignup } from "@/api/auth"
import { AxiosError } from "axios"
import type { ErrorResponse, SuccessResponse } from "database/src/types"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

export const SignUpForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirect = searchParams.get("redirect") ?? "/"

  const form = useForm<SignupSchema>({
    defaultValues: {
      username: "",
      password: "",
      confirm: "",
    },
    resolver: zodResolver(signupSchema),
  })

  const [response, setResponse] = useState<SuccessResponse | ErrorResponse | null>(null)

  const queryClient = useQueryClient()

  const { mutate: signup } = useMutation({
    mutationFn: postSignup,
    onSuccess: async ({ data }) => {
      console.log("Signup success")
      await queryClient.invalidateQueries({ queryKey: ["user"] })
      setResponse(data)
      toast.success("Signup success", {
        description: "Account successfully created",
      })
      router.push(redirect)
    },
    onError: (error) => {
      let message = "Sign up failed"

      if (error instanceof AxiosError) {
        const response = error.response?.data as ErrorResponse
        message = response.error
      }

      setResponse({ success: false, error: message })
      toast.error("Sign up failed", { description: message })
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm: _, ...signupData } = data
    signup(signupData)
  })

  const isDisabled = form.formState.isSubmitting

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

          {response?.success && <FormSuccess message={response.message} />}
          {response?.success === false && <FormError message={response.error} />}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
