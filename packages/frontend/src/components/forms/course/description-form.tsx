"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import {
  descriptionSchema,
  type DescriptionSchema,
} from "@/lib/validators/course"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { patchCourse } from "@/api/course"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  initialData: Course
}

export const DescriptionForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<DescriptionSchema>({
    defaultValues: {
      description: initialData.description ?? "",
    },
    resolver: zodResolver(descriptionSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: (payload: DescriptionSchema) => patchCourse(courseId, payload),
    onSuccess: ({ data }) => {
      console.log("data:", data)

      toast.success("Update course success", {
        description: `The course description updated successfully`,
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast.error("Update course error", {
        description: "Something went wrong!",
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
        <span>Course description</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Course Description..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    {"e.g. 'This course is about...'"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || isPending}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.description && "italic text-slate-500"
          )}
        >
          {initialData.description || "No description"}
        </p>
      )}
    </div>
  )
}
