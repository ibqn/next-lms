"use client"

import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ParamIdSchema } from "database/src/validators/param"
import { toast } from "sonner"
import { dashboardCourseListQueryOptions, courseQueryOptions, deleteCourse, patchCourse } from "@/api/course"
import type { PublishSchema } from "@/lib/validators/chapter"
import type { Course } from "database/src/drizzle/schema/course"

type CourseActionsProps = {
  course: Course
  disabled: boolean
}

export const CourseActions = ({ course, disabled }: CourseActionsProps) => {
  const { isPublished } = course

  const router = useRouter()

  const queryClient = useQueryClient()

  const { mutate: removeCourse, isPending: isRemovePending } = useMutation({
    mutationFn: (payload: ParamIdSchema) => deleteCourse(payload.id),
    onSuccess: (data) => {
      console.log("data:", data)

      toast.success("Course deleted", {
        description: `The course was deleted successfully`,
      })

      router.push(`/teacher/courses`)
    },
    onError: () => {
      toast.error("Update course error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardCourseListQueryOptions().queryKey,
      })
    },
  })

  const { mutate: updateCourse, isPending: isUpdatePending } = useMutation({
    mutationFn: (payload: PublishSchema) => patchCourse(course.id, payload),
    onSuccess: (course) => {
      console.log("data:", course)

      toast.success("Update course success", {
        description: `The course access settings updated successfully`,
      })
      router.refresh()
    },
    onError: () => {
      toast.error("Update course error", {
        description: "Something went wrong!",
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: courseQueryOptions({ id: course.id }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: dashboardCourseListQueryOptions().queryKey,
      })
      router.refresh()
    },
  })

  const togglePublish = () => {
    updateCourse({ isPublished: !isPublished })
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button variant="outline" size="sm" disabled={disabled || isUpdatePending} onClick={togglePublish}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={() => removeCourse({ id: course.id })}>
        <Button size="sm" disabled={isRemovePending}>
          <TrashIcon className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
