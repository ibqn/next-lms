import { dashboardCourseListQueryOptions } from "@/api/course"
import { CourseList } from "@/components/lists/course-list"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"

export default async function CoursesPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(dashboardCourseListQueryOptions())

  return (
    <Suspense fallback="Loading...">
      <CourseList />
    </Suspense>
  )
}
