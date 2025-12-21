import { chapterQueryOptions } from "@/api/chapter"
import { getQueryClient } from "@/lib/query-client"
import { paramIdSchema } from "database/src/validators/param"
import { notFound } from "next/navigation"
import { Suspense, type PropsWithChildren } from "react"

type CourseIdLayoutProps = PropsWithChildren<{
  params: Promise<{
    chapterId: string
  }>
}>

export default async function ChapterIdLayout({ children, params }: CourseIdLayoutProps) {
  const { chapterId } = await params

  const chapterIdParseResult = await paramIdSchema.safeParseAsync({ id: chapterId })
  if (!chapterIdParseResult.success) {
    return notFound()
  }

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(chapterQueryOptions({ id: chapterIdParseResult.data.id }))

  return <Suspense>{children}</Suspense>
}
