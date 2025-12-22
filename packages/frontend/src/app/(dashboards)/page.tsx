import { dashboardCourseListQueryOptions } from "@/api/course"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"

export default async function HomePage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(dashboardCourseListQueryOptions())

  return (
    <Suspense>
      <DashboardPage />
    </Suspense>
  )
}
