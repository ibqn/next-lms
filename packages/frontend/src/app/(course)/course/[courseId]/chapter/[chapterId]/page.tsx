"use client"

import { chapterQueryOptions } from "@/api/chapter"
import { courseQueryOptions } from "@/api/course"
import { progressQueryOptions } from "@/api/progress"
import { purchaseQueryOptions } from "@/api/purchase"
import { Banner } from "@/components/banner"
import { CourseEnrollButton } from "@/components/course/course-enroll-button"
import { CourseProgressButton } from "@/components/course/course-progress-button"
import { CourseVideoPlayer } from "@/components/course/course-video-player"
import { Heading } from "@/components/heading"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import type { Course } from "database/src/drizzle/schema/course"
import { FileIcon } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo } from "react"

type ChapterParams = {
  chapterId: Chapter["id"]
  courseId: Course["id"]
}

export default function ChapterIdPage() {
  const { chapterId, courseId } = useParams<ChapterParams>()

  const BubbleEditor = dynamic(
    async () => {
      const { BubbleEditor } = await import("@/components/bubble-editor")
      return BubbleEditor
    },
    { ssr: false }
  )

  const { data: chapter } = useSuspenseQuery(chapterQueryOptions({ id: chapterId }))
  const { data: course } = useSuspenseQuery(courseQueryOptions({ id: courseId }))
  const { data: purchase } = useSuspenseQuery(purchaseQueryOptions({ id: courseId }))
  const { data: progress } = useSuspenseQuery(progressQueryOptions({ id: courseId }))

  const isLocked = useMemo(() => !chapter?.isFree && !purchase, [chapter, purchase])

  const isCompleted = useMemo(
    () => progress?.completedChapters.some(({ id }) => id === chapterId) ?? false,
    [progress, chapterId]
  )

  const nextChapterId = useMemo(() => {
    if (!course?.chapters) {
      return null
    }

    const currentChapterIndex = course.chapters.findIndex((ch) => ch.id === chapterId)
    if (currentChapterIndex === -1 || currentChapterIndex === course.chapters.length - 1) {
      return null
    }

    return course.chapters[currentChapterIndex + 1].id
  }, [course?.chapters, chapterId])

  return (
    <div className="flex w-full flex-1 flex-col">
      {isCompleted && <Banner variant="success" label="You already completed this chapter." />}
      {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter." />}

      <div className="mx-auto flex w-full max-w-4xl flex-col pb-20">
        <div className="p-4">
          <CourseVideoPlayer isLocked={isLocked} videoUrl={chapter?.videoUrl ?? null} />
        </div>

        <div className="flex flex-col items-center justify-between p-4 md:flex-row">
          <div>
            <Heading>title</Heading>
            <h2 className="mb-2 text-2xl font-semibold">{chapter?.title}</h2>
          </div>

          {purchase ? (
            <CourseProgressButton chapterId={chapterId} isCompleted={isCompleted} />
          ) : (
            <CourseEnrollButton courseId={course?.id} price={course?.price} />
          )}
        </div>

        <div className="p-4">
          <Heading>description</Heading>
          {chapter?.description ? (
            <BubbleEditor value={chapter.description} className="[&_.ql-container]:text-base!" />
          ) : (
            "No description"
          )}
        </div>

        {course?.attachments && course.attachments.length > 0 && (
          <div className="p-4">
            <Heading>attachments</Heading>
            <ul className="mt-2 flex flex-col gap-y-2">
              {course.attachments.map((attachment) => (
                <div
                  key={attachment.url}
                  className="flex items-center gap-2 rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <FileIcon className="size-4 shrink-0" />
                  <div className="grow">
                    <Link className="line-clamp-1 text-xs" target="_blank" href={attachment.url}>
                      {attachment.name}
                    </Link>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
