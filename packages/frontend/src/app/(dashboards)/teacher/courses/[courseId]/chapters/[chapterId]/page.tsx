import { dashboardChapterQueryOptions } from "@/api/chapter"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"
import { ChapterPage } from "@/components/pages/chapter-page"

type Props = {
  params: Promise<{
    chapterId: string
  }>
}

export default async function SingleChapterPage({ params }: Props) {
  const { chapterId } = await params

  const queryClient = getQueryClient()
  queryClient.prefetchQuery(dashboardChapterQueryOptions({ id: chapterId }))

  return (
    <Suspense fallback="Loading...">
      <ChapterPage chapterId={chapterId} />
    </Suspense>
  )
}
