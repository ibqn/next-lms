"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { categorySchema, type CategorySchema } from "@/lib/validators/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { courseQueryOptions, patchCourse } from "@/api/course"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/combobox"
import { categoryQueryOptions } from "@/api/category"

type Props = {
  initialData: Course
}

export const CategoryForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData
  const { data: categories } = useSuspenseQuery(categoryQueryOptions())

  const categoryOptions =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) ?? []

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<CategorySchema>({
    defaultValues: {
      categoryId: initialData.categoryId,
    },
    resolver: zodResolver(categorySchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: (payload: CategorySchema) => patchCourse(courseId, payload),
    onSuccess: ({ data }) => {
      console.log("data:", data)

      toast.success("Update course success", {
        description: `The course Category updated successfully`,
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast.error("Update course error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: courseQueryOptions({ id: courseId }).queryKey,
      })
      router.refresh()
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    updateCourse(data)
  })

  const selectedCategory = categories?.find((category) => category.id === initialData.categoryId)

  return (
    <div className="rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Course category</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 size-4" />
              Edit Category
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox {...field} options={categoryOptions} />
                  </FormControl>
                  <FormDescription>Select a category for your course</FormDescription>
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
        <p className={cn("mt-2 text-sm", !initialData.categoryId && "text-slate-500 italic")}>
          {selectedCategory?.name || "No Category"}
        </p>
      )}
    </div>
  )
}
