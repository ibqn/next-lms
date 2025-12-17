"use client"

import { courseQueryOptions } from "@/api/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { Course } from "database/src/drizzle/schema/course"
import { redirect, useParams } from "next/navigation"

export default function CourseIdPage() {
  const { courseId } = useParams<{ courseId: Course["id"] }>()

  const { data: course } = useSuspenseQuery(courseQueryOptions({ id: courseId }))

  const [firstChapter] = course?.chapters ?? []

  if (firstChapter) {
    redirect(`/course/${courseId}/chapter/${firstChapter.id}`)
  }

  return <div>Course Page for {course?.title}</div>
}
