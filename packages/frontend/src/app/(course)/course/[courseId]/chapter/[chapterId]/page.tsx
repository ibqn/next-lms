"use client"

import { chapterQueryOptions } from "@/api/chapter"
import { courseQueryOptions } from "@/api/course"
import { Banner } from "@/components/banner"
import { CourseEnrollButton } from "@/components/course/course-enroll-button"
import { CourseVideoPlayer } from "@/components/course/course-video-player"
import { Heading } from "@/components/heading"
import { useQuery } from "@tanstack/react-query"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import type { Course } from "database/src/drizzle/schema/course"
import { useParams } from "next/navigation"

type ChapterParams = {
  chapterId: Chapter["id"]
  courseId: Course["id"]
}

export default function ChapterIdPage() {
  const { chapterId, courseId } = useParams<ChapterParams>()

  const { data: chapter } = useQuery(chapterQueryOptions({ id: chapterId }))
  const { data: course } = useQuery(courseQueryOptions({ id: courseId }))

  const isLocked = false
  const isCompleted = false
  const purchased = false

  return (
    <div className="flex w-full flex-1">
      {isCompleted && <Banner variant="success" label="You already completed this chapter." />}
      {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter." />}

      <div className="mx-auto flex w-full max-w-4xl flex-col pb-20">
        <div className="p-4">
          <CourseVideoPlayer isLocked={isLocked} videoUrl={chapter?.videoUrl ?? null} />
        </div>

        <div className="flex flex-col items-center justify-between p-4 md:flex-row">
          <div>
            <Heading>chapter title</Heading>
            <h2 className="mb-2 text-2xl font-semibold">{chapter?.title}</h2>
          </div>

          {purchased ? <div>todo progress</div> : <CourseEnrollButton courseId={chapter?.id} price={course?.price} />}
        </div>
      </div>
    </div>
  )
}
