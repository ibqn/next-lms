"use client"

import { chapterQueryOptions } from "@/api/chapter"
import { Banner } from "@/components/banner"
import { CourseVideoPlayer } from "@/components/course/course-video-player"
import { useQuery } from "@tanstack/react-query"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { useParams } from "next/navigation"

export default function ChapterIdPage() {
  const { chapterId } = useParams<{ chapterId: Chapter["id"] }>()

  const { data: chapter } = useQuery(chapterQueryOptions({ id: chapterId }))

  const isLocked = false
  const isCompleted = false

  return (
    <div className="flex w-full flex-1">
      {isCompleted && <Banner variant="success" label="You already completed this chapter." />}
      {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter." />}

      <div className="mx-auto flex w-full max-w-4xl flex-col pb-20">
        <div className="p-4">
          <CourseVideoPlayer isLocked={isLocked} videoUrl={chapter?.videoUrl ?? null} />
        </div>

        <div className="flex flex-col items-center justify-between p-4 md:flex-row">
          <h2 className="mb-2 text-2xl font-semibold">{chapter?.title}</h2>
        </div>
      </div>
    </div>
  )
}
