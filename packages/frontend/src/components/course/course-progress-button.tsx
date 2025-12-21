"use client"

import { patchUserChapterProgress } from "@/api/progress"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"
import { toast } from "sonner"

type CourseProgressButtonProps = {
  isCompleted: boolean
  chapterId: string
}

export const CourseProgressButton = ({ isCompleted, chapterId }: CourseProgressButtonProps) => {
  const Icon = isCompleted ? XCircleIcon : CheckCircleIcon

  const queryClient = useQueryClient()

  const { mutate: toggleChapterProgress, isPending } = useMutation({
    mutationFn: async (isCompleted: boolean) =>
      patchUserChapterProgress({
        id: chapterId,
        isCompleted,
      }),
    onSuccess: (data) => {
      console.log("Toggled chapter progress:", data)
      toast.success(`Chapter marked as ${isCompleted ? "not completed" : "completed"}`)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["progress"] })
    },
  })

  const handleClick = () => {
    toggleChapterProgress(!isCompleted)
  }

  return (
    <Button onClick={handleClick} disabled={isPending} type="button" variant={isCompleted ? "outline" : "success"}>
      {isCompleted ? "Not Completed" : "Mark as Completed"}
      <Icon className="ml-2 size-4" />
    </Button>
  )
}
