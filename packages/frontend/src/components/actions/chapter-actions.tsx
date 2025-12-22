"use client"

import type { Chapter } from "database/src/drizzle/schema/chapter"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ParamIdSchema } from "database/src/validators/param"
import { editorChapterQueryOptions, deleteChapter, patchChapter } from "@/api/chapter"
import { toast } from "sonner"
import { editorCourseQueryOptions } from "@/api/course"
import type { PublishSchema } from "@/lib/validators/chapter"

type ChapterActionsProps = {
  chapter: Chapter
  disabled: boolean
}

export const ChapterActions = ({ chapter, disabled }: ChapterActionsProps) => {
  const { isPublished } = chapter

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: removeChapter, isPending: isRemovePending } = useMutation({
    mutationFn: (payload: ParamIdSchema) => deleteChapter(payload.id),
    onSuccess: (data) => {
      console.log("data:", data)

      toast.success("Chapter deleted", {
        description: `The chapter was deleted successfully`,
      })

      router.push(`/teacher/courses/${chapter.courseId}`)
    },
    onError: () => {
      toast.error("Update chapter error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: editorCourseQueryOptions({ id: chapter.courseId }).queryKey,
      })
    },
  })

  const { mutate: updateChapter, isPending: isUpdatePending } = useMutation({
    mutationFn: (payload: PublishSchema) => patchChapter(chapter.id, payload),
    onSuccess: (chapter) => {
      console.log("data:", chapter)

      toast.success("Update chapter success", {
        description: `The chapter access settings updated successfully`,
      })
      router.refresh()
    },
    onError: () => {
      toast.error("Update chapter error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: editorChapterQueryOptions({ id: chapter.id }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: editorCourseQueryOptions({ id: chapter.courseId }).queryKey,
      })
      router.refresh()
    },
  })

  const togglePublish = () => {
    updateChapter({ isPublished: !isPublished })
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button variant="outline" size="sm" disabled={disabled || isUpdatePending} onClick={togglePublish}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={() => removeChapter({ id: chapter.id })}>
        <Button size="sm" disabled={isRemovePending}>
          <TrashIcon className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
