"use client"

import type { Chapter } from "database/src/drizzle/schema/chapter"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { accessSchema, AccessSchema } from "@/lib/validators/chapter"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { chapterQueryOptions, patchChapter } from "@/api/chapter"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { courseQueryOptions } from "@/api/course"

type Props = {
  initialData: Chapter
}

export const AccessForm = ({ initialData }: Props) => {
  const { id: chapterId, courseId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<AccessSchema>({
    defaultValues: {
      isFree: initialData.isFree ?? false,
    },
    resolver: zodResolver(accessSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: updateChapter, isPending } = useMutation({
    mutationFn: (payload: AccessSchema) => patchChapter(chapterId, payload),
    onSuccess: (chapter) => {
      console.log("data:", chapter)

      toast.success("Update chapter success", {
        description: `The chapter access settings updated successfully`,
      })
      toggleEdit()
      router.refresh()
    },
    onError: () => {
      toast.error("Update chapter error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: chapterQueryOptions({ id: chapterId }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: courseQueryOptions({ id: courseId }).queryKey,
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
        <span>Chapter access settings</span>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PencilIcon className="mr-2 size-4" />
              Edit access settings
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>Check this box if you want to make this chapter free for preview</FormDescription>
                  </div>

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
        <div className={cn("mt-2 text-sm", !initialData.isFree && "text-slate-500 italic")}>
          {initialData.isFree ? <>This chapter is free for preview</> : <>This chapter is not free for preview</>}
        </div>
      )}
    </div>
  )
}
