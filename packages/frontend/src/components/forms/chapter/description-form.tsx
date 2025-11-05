"use client"

import type { Chapter } from "database/src/drizzle/schema/chapter"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { descriptionSchema, type DescriptionSchema } from "@/lib/validators/chapter"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { chapterQueryOptions, patchChapter } from "@/api/chapter"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const SnowEditor = dynamic(() => import("@/components/snow-editor").then((mod) => mod.SnowEditor), { ssr: false })
const BubbleEditor = dynamic(
  async () => {
    const { BubbleEditor } = await import("@/components/bubble-editor")
    return BubbleEditor
  },
  { ssr: false }
)

type Props = {
  initialData: Chapter
}

export const DescriptionForm = ({ initialData }: Props) => {
  const { id: chapterId } = initialData

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((prev) => !prev)

  const form = useForm<DescriptionSchema>({
    defaultValues: {
      description: initialData.description ?? "{}",
    },
    resolver: zodResolver(descriptionSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: updateChapter, isPending } = useMutation({
    mutationFn: (payload: DescriptionSchema) => patchChapter(chapterId, payload),
    onSuccess: (chapter) => {
      console.log("data:", chapter)

      toast.success("Update chapter success", {
        description: `The chapter description updated successfully`,
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
        queryKey: chapterQueryOptions(chapterId).queryKey,
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
        <span>Chapter description</span>
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
                    <SnowEditor {...field} />
                  </FormControl>
                  <FormDescription>{"e.g. 'This chapter is about...'"}</FormDescription>
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
        <div className={cn("mt-2 text-sm", !initialData.description && "text-slate-500 italic")}>
          {initialData.description ? <BubbleEditor value={initialData.description} /> : "No description"}
        </div>
      )}
    </div>
  )
}
