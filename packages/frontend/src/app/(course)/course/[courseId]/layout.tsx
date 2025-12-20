import { courseQueryOptions } from "@/api/course"
import { purchaseQueryOptions } from "@/api/purchase"
import { validateRequest } from "@/auth"
import { CourseNavbar } from "@/components/course/course-navbar"
import { CourseSidebar } from "@/components/course/course-sidebar"
import { getQueryClient } from "@/lib/query-client"
import { paramIdSchema } from "database/src/validators/param"
import { notFound, redirect } from "next/navigation"
import { Suspense, type PropsWithChildren } from "react"

type CourseIdLayoutProps = PropsWithChildren<{
  params: Promise<{ courseId: string }>
}>

export default async function CourseIdLayout({ children, params }: CourseIdLayoutProps) {
  const { user } = await validateRequest()
  if (!user) {
    return redirect("/sign-in")
  }

  const { courseId } = await params

  const courseIdParseResult = await paramIdSchema.safeParseAsync({ id: courseId })
  if (!courseIdParseResult.success) {
    return notFound()
  }

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(courseQueryOptions({ id: courseIdParseResult.data.id }))
  await queryClient.prefetchQuery(purchaseQueryOptions({ id: courseIdParseResult.data.id }))

  return (
    <Suspense fallback="Loading...">
      <div className="flex h-full flex-1">
        <div className="fixed inset-y-0 z-50 h-20 w-full lg:pl-80">
          <CourseNavbar />
        </div>
        <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col lg:flex">
          <CourseSidebar />
        </div>
        <main className="flex h-full flex-1 pt-20 lg:pl-80">{children}</main>
      </div>
    </Suspense>
  )
}
