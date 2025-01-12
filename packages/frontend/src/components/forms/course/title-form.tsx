"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { titleSchema, type TitleSchema } from "@/lib/validators/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { patchCourse } from "@/api/course"
import { useRouter } from "next/navigation"

type Props = {
  initialData: Course
}

export const TitleForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<TitleSchema>({
    defaultValues: {
      title: initialData.title,
    },
    resolver: zodResolver(titleSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const { toast } = useToast()

  const router = useRouter()

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: (payload: TitleSchema) => patchCourse(courseId, payload),
    onSuccess: ({ data }) => {
      console.log("data:", data)
      const { title } = data

      toast({
        title: "Update course success",
        description: `The course title '${title}' was updated successfully`,
        variant: "green",
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast({
        title: "Update course error",
        description: "Something went wrong!",
        variant: "destructive",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    updateCourse(data)
  })

  return (
    <div className="rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Course title</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Course Title..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>{"e.g. 'Introduction to Computer Science'"}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isSubmitting || !isValid || isPending}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p className="mt-2 text-sm">{initialData.title}</p>
      )}
    </div>
  )
}
