import { categoryQueryOptions } from "@/api/category"
import { getQueryClient } from "@/lib/query-client"
import { courseQueryOptions } from "@/api/course"
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
  await queryClient.prefetchQuery(courseQueryOptions({ id: courseId }))

  // const course = queryClient.getQueryData(["course", courseId])

  // if (!course) {
  //   return notFound()
  // }
  console.log("courseId:", courseId)

  await queryClient.prefetchQuery(categoryQueryOptions())

  return (
    <Suspense fallback="Loading...">
      <CoursePage courseId={courseId} />
    </Suspense>
  )
}
