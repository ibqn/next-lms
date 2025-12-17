"use client"

import { courseQueryOptions } from "@/api/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { Course } from "database/src/drizzle/schema/course"
import { useParams } from "next/navigation"
import { CourseSidebarChapter } from "@/components/course-sidebar-chapter"

export const CourseSidebar = () => {
  const { courseId } = useParams<{ courseId: Course["id"] }>()

  const { data: course } = useSuspenseQuery(courseQueryOptions({ id: courseId }))

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="font-semibold">{course?.title}</h1>
      </div>

      <div className="flex w-full flex-col">
        {course?.chapters?.map((chapter) => (
          <CourseSidebarChapter key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  )
}
