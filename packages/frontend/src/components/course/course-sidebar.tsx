"use client"

import { courseQueryOptions } from "@/api/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { Course } from "database/src/drizzle/schema/course"
import { useParams } from "next/navigation"
import { CourseSidebarChapter } from "@/components/course/course-sidebar-chapter"
import { Heading } from "@/components/heading"
import { purchaseQueryOptions } from "@/api/purchase"
import { CourseProgress } from "@/components/course/course-progress"

export const CourseSidebar = () => {
  const { courseId } = useParams<{ courseId: Course["id"] }>()

  const { data: course } = useSuspenseQuery(courseQueryOptions({ id: courseId }))
  const { data: purchase } = useSuspenseQuery(purchaseQueryOptions({ id: courseId }))

  return (
    <div className="flex h-full flex-col gap-y-8 overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col px-6 py-8">
        <Heading>course title</Heading>
        <h1 className="font-semibold">{course?.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={0} />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col">
        <Heading className="px-6">course chapters</Heading>
        {course?.chapters?.map((chapter) => (
          <CourseSidebarChapter key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  )
}
