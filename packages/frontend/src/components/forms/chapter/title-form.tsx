"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { titleSchema, type TitleSchema } from "@/lib/validators/chapter"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { editorChapterQueryOptions, patchChapter } from "@/api/chapter"
import { isAxiosError } from "axios"
import { ErrorResponse } from "database/src/types"

type Props = {
  initialData: Chapter
}

export const TitleForm = ({ initialData }: Props) => {
  const { id: chapterId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<TitleSchema>({
    defaultValues: {
      title: initialData.title,
    },
    resolver: zodResolver(titleSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: updateChapter, isPending } = useMutation({
    mutationFn: (payload: TitleSchema) => patchChapter(chapterId, payload),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: editorChapterQueryOptions({ id: chapterId }).queryKey,
      })
      router.refresh()
    },
    onSuccess: (chapter: Chapter | null) => {
      console.log("data:", chapter)
      const title = chapter?.title
      toast.success("Update course success", {
        description: `The course title '${title}' was updated successfully`,
      })
      toggleEdit()
    },
    onError: (error: Error) => {
      let message: string | null = null

      if (isAxiosError(error)) {
        const data = error.response?.data as ErrorResponse
        message = data.error
      }
      toast.error("Chapter update failed", {
        description: message ?? "Something went wrong!",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    updateChapter(data)
  })

  return (
    <div className="rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        <span>Chapter title</span>
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
                    <Input placeholder="Chapter Title..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>{"e.g. 'Introduction'"}</FormDescription>
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
