import { categoryQueryOptions } from "@/api/category"
import { ExplorePage } from "@/components/pages/explore-page"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"

export default async function SingleExplorePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(categoryQueryOptions())

  return (
    <Suspense fallback="Loading...">
      <ExplorePage />
    </Suspense>
  )
}
