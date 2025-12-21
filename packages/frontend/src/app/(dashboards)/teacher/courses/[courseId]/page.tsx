import { categoryQueryOptions } from "@/api/category"
import { getQueryClient } from "@/lib/query-client"
import { dashboardCourseQueryOptions } from "@/api/course"
import { Suspense } from "react"
import { CoursePage } from "@/components/pages/course-page"

type Props = {
  params: Promise<{
    courseId: string
  }>
}

export default async function SingleCoursePage({ params }: Props) {
  const { courseId } = await params

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(dashboardCourseQueryOptions({ id: courseId }))

  console.log("courseId:", courseId)

  await queryClient.prefetchQuery(categoryQueryOptions())

  return (
    <Suspense fallback="Loading...">
      <CoursePage courseId={courseId} />
    </Suspense>
  )
}
