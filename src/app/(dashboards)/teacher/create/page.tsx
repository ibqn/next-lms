"use client"

import { courseSchema, type CourseSchema } from "@/lib/validators/course"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function CreatePage() {
  const form = useForm<CourseSchema>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(courseSchema),
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-3xl font-semibold">Name your course</h1>
        <p className="mt-2 text-sm text-slate-600">
          {
            "What would you like to name your course? Don't worry, you can change this later."
          }
        </p>
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-8 space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Course Title..." {...field} />
                  </FormControl>
                  <FormDescription>
                    {"e.g. 'Introduction to Computer Science'"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link
                href="/teacher/courses"
                className={buttonVariants({ variant: "ghost" })}
              >
                Cancel
              </Link>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
