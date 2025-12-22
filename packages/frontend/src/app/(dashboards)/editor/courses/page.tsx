import { editorCourseListQueryOptions } from "@/api/course"
import { CourseList } from "@/components/lists/course-list"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"

export default async function CoursesPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(editorCourseListQueryOptions())

  return (
    <Suspense fallback="Loading...">
      <CourseList />
    </Suspense>
  )
}
