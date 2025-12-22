import { editorAnalyticsQueryOptions } from "@/api/course"
import { AnalyticsPage } from "@/components/pages/analytics-page"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"

export default async function AnalyticsServerPage() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(editorAnalyticsQueryOptions())
  return (
    <Suspense>
      <AnalyticsPage />
    </Suspense>
  )
}
