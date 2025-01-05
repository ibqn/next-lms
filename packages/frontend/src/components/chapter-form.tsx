"use client"

import type { Course } from "database/src/drizzle/schema/course"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { titleSchema } from "@/lib/validators/chapter"
import type { TitleSchema } from "@/lib/validators/course"
import { Input } from "@/components/ui/input"
import { postChapter } from "@/api/chapter"
import { ChapterList } from "@/components/chapter-list"

type Props = {
  initialData: Course
}

export const ChapterForm = ({ initialData }: Props) => {
  const { id: courseId } = initialData

  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCreating = () => setIsCreating((prev) => !prev)

  const form = useForm<TitleSchema>({
    defaultValues: { title: "" },
    resolver: zodResolver(titleSchema),
  })

  const { isSubmitting, isValid } = form.formState

  const { toast } = useToast()

  const router = useRouter()

  const { mutate: createChapter, isPending } = useMutation({
    mutationFn: (payload: TitleSchema) => postChapter({ ...payload, courseId }),
    onSuccess: (data) => {
      console.log("data:", data)

      toast({
        title: "Create chapter success",
        description: `The course description updated successfully`,
        variant: "green",
      })
      toggleCreating()
      router.refresh()
    },
    onError: () => {
      toast({
        title: "Create chapter error",
        description: "Something went wrong!",
        variant: "destructive",
      })
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    console.log(data)
    createChapter(data)
  })

  return (
    <div className="rounded-md border bg-slate-100 p-4">
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
          <p className={cn("mt-2 text-sm", !initialData.chapters?.length && "italic text-slate-500")}>
            {!initialData.chapters?.length && "No chapters yet"}
          </p>
          <ChapterList chapters={initialData.chapters ?? []} />

          <p className="mt-4 text-sm text-muted-foreground">Drag {"'n'"} Drop to reorder chapters</p>
        </>
      )}
    </div>
  )
}
