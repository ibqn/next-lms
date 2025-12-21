"use client"

import { courseListQueryOptions } from "@/api/course"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { CourseCard } from "./course/course-card"

export const ExploreCourseList = () => {
  const searchParams = useSearchParams()

  const category = searchParams.get("category") ?? undefined
  const searchTitle = searchParams.get("title") ?? undefined

  const { data, isLoading } = useQuery(courseListQueryOptions({ category, searchTitle }))

  const { courseItems: courses = [] } = data ?? {}

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {courses.length === 0 && <div className="text-muted-foreground mt-10 text-center text-sm">No courses found.</div>}
    </div>
  )
}
