"use client"

import type { Chapter } from "database/src/drizzle/schema/chapter"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ParamIdSchema } from "database/src/validators/param"
import { deleteChapter } from "@/api/chapter"
import { toast } from "sonner"
import { courseQueryOptions } from "@/api/course"

type ChapterActionsProps = {
  chapter: Chapter
  disabled: boolean
}

export const ChapterActions = ({ chapter, disabled }: ChapterActionsProps) => {
  const { isPublished } = chapter

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: removeChapter, isPending } = useMutation({
    mutationFn: (payload: ParamIdSchema) => deleteChapter(payload.id),
    onSuccess: (data) => {
      console.log("data:", data)

      toast.success("Chapter deleted", {
        description: `The chapter was deleted successfully`,
      })

      router.push(`/teacher/courses/${chapter.courseId}`)
    },
    onError: () => {
      toast.error("Update course error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: courseQueryOptions({ id: chapter.courseId }).queryKey,
      })
    },
  })

  return (
    <div className="flex items-center gap-x-2">
      <Button variant="outline" size="sm" disabled={disabled}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={() => removeChapter({ id: chapter.id })}>
        <Button size="sm" disabled={isPending}>
          <Trash className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
