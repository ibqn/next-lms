"use client"

import { dashboardCourseListQueryOptions } from "@/api/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { CourseCard } from "../course/course-card"
import { CheckCircleIcon, ClockIcon } from "lucide-react"
import { InfoCard } from "../info-card"

const formatCourseCount = (count: number): string => {
  return count + " Course" + (count === 1 ? "" : "s")
}

export const DashboardPage = () => {
  const { data: courseData } = useSuspenseQuery(dashboardCourseListQueryOptions())
  const { completedCourses = [], coursesInProgress = [] } = courseData ?? {}

  const courses = useMemo(() => [...coursesInProgress, ...completedCourses], [completedCourses, coursesInProgress])

  return (
    <div className="flex min-h-full flex-col gap-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={ClockIcon} label="In Progress" value={formatCourseCount(coursesInProgress.length)} />

        <InfoCard
          icon={CheckCircleIcon}
          label="Completed"
          variant="success"
          value={formatCourseCount(completedCourses.length)}
        />
      </div>

      <div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {courses.map(({ course }) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-muted-foreground mt-10 text-center text-sm">No courses found.</div>
        )}
      </div>
    </div>
  )
}
