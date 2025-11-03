import { courseListQueryOptions } from "@/api/course"
import { CourseList } from "@/components/lists/course-list"
import { buttonVariants } from "@/components/ui/button"
import { getQueryClient } from "@/lib/query-client"
// import { getCourseItems } from "database/src/queries/course"
import Link from "next/link"
import { Suspense } from "react"

export default async function CoursesPage() {
  // const courseItems = await getCourseItems()

  // console.log("courseItems", courseItems)

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(courseListQueryOptions())
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <Suspense fallback="Loading...">
        <CourseList />
      </Suspense>
    </div>
  )
}
