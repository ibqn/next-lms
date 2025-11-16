import { chapterQueryOptions } from "@/api/chapter"
import { getQueryClient } from "@/lib/query-client"
import { Suspense } from "react"
import { ChapterPage } from "@/components/pages/chapter-page"

type Props = {
  params: Promise<{
    courseId: string
    chapterId: string
  }>
}

export default async function SingleChapterPage({ params }: Props) {
  const { chapterId } = await params

  const queryClient = getQueryClient()
  queryClient.prefetchQuery(chapterQueryOptions({ id: chapterId }))

  return (
    <Suspense fallback="Loading...">
      <ChapterPage chapterId={chapterId} />
    </Suspense>
  )
}
