"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon, PlusCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { titleSchema } from "@/lib/validators/chapter"
import type { TitleSchema } from "@/lib/validators/course"
import { Input } from "@/components/ui/input"
import { postChapter, postReorderChapters } from "@/api/chapter"
import { ChapterList } from "@/components/chapter-list"

type Props = {
  initialData: Course
}

export const ChapterForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isCreating, setIsCreating] = useState(false)

  const toggleCreating = () => setIsCreating((prev) => !prev)

  const form = useForm<TitleSchema>({
    defaultValues: { title: "" },
    resolver: zodResolver(titleSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const router = useRouter()

  const { mutate: createChapter, isPending } = useMutation({
    mutationFn: (payload: TitleSchema) => postChapter({ ...payload, courseId }),
    onSuccess: () => {
      toast.success("Create chapter success", {
        description: `The course description updated successfully`,
      })
      toggleCreating()
      router.refresh()
    },
    onError: () => {
      toast.error("Create chapter error", {
        description: "Something went wrong!",
      })
    },
  })

  const { mutate: reorderChapters, isPending: isPendingReorder } = useMutation({
    mutationFn: postReorderChapters,
    onSuccess: () => {
      toast.success("Reorder chapter success", {
        description: `The chapters reordered successfully`,
      })
      router.refresh()
    },
    onError: () => {
      toast.error("Reorder chapter error", {
        description: "Something went wrong!",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    createChapter(data)
  })

  return (
    <div className={cn("relative rounded-md border bg-slate-100 p-4", isPendingReorder && "pointer-events-none")}>
      {isPendingReorder && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-slate-500/20">
          <Loader2Icon className="size-6 animate-spin text-sky-500" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        <span>Course chapters</span>
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircleIcon className="mr-2 size-4" />
              add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title description..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>{"e.g. 'Introduction to the course...'"}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || !isValid || isPending}>
              Create
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <p className={cn("mt-2 text-sm", !initialData.chapters?.length && "text-slate-500 italic")}>
            {!initialData.chapters?.length && "No chapters yet"}
          </p>
          <ChapterList
            chapters={initialData.chapters ?? []}
            onReorder={(reorderData) => {
              reorderChapters(reorderData)
            }}
          />

          <p className="text-muted-foreground mt-4 text-sm">Drag {"'n'"} Drop to reorder chapters</p>
        </>
      )}
    </div>
  )
}
