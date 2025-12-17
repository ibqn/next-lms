import { courseQueryOptions } from "@/api/course"
import { validateRequest } from "@/auth"
import { CourseNavbar } from "@/components/course-navbar"
import { CourseSidebar } from "@/components/course-sidebar"
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

  const parseResult = await paramIdSchema.safeParseAsync({ id: courseId })
  if (!parseResult.success) {
    return notFound()
  }

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(courseQueryOptions({ id: parseResult.data.id }))

  return (
    <Suspense fallback="Loading...">
      <div className="h-full">
        <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-80">
          <CourseNavbar />
        </div>
        <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
          <CourseSidebar />
        </div>
        <main className="h-full pt-20 md:pl-80">{children}</main>
      </div>
    </Suspense>
  )
}
