import { chapterQueryOptions } from "@/api/chapter"
import { getQueryClient } from "@/lib/query-client"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ChapterPage } from "../_components/chapter-page"

type Props = {
  params: Promise<{
    courseId: string
    chapterId: string
  }>
}

export default async function SingleChapterPage({ params }: Props) {
  const { courseId, chapterId } = await params

  const queryClient = getQueryClient()
  queryClient.prefetchQuery(chapterQueryOptions(chapterId))

  return (
    <div className="flex grow flex-col p-6">
      <div className="mb-4 flex">
        <Link href={`/teacher/courses/${courseId}`} className="flex items-center text-sm hover:opacity-75">
          <ArrowLeftIcon className="mr-2 size-4" />
          Back to course setup
        </Link>
      </div>

      <Suspense fallback="Loading...">
        <ChapterPage chapterId={chapterId} />
      </Suspense>
    </div>
  )
}
