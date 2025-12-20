"use client"

import type { Course } from "database/src/drizzle/schema/course"
import Link from "next/link"
import { Image } from "@/components/optimized-image"
import { IconBadge } from "@/components/icon-badge"
import { BookOpenIcon } from "lucide-react"
import { formatPrice } from "@/lib/format-price"
import { useSuspenseQuery } from "@tanstack/react-query"
import { progressQueryOptions } from "@/api/progress"
import { CourseProgress } from "./course-progress"

type CourseCardProps = {
  course: Course
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const { data } = useSuspenseQuery(progressQueryOptions({ id: course.id }))
  const { progressPercentage = null } = data ?? {}

  return (
    <Link href={`/course/${course.id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full rounded-md">
          {course.imageUrl && <Image fill className="object-cover" src={course.imageUrl} alt={course.title} />}
        </div>
        <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
          {course.title}
        </div>
        <p className="text-muted-foreground text-xs">{course.category?.name}</p>
        <div className="my-3 flex items-center gap-x-3 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <IconBadge icon={BookOpenIcon} size="sm" />
            <span>
              {course.chapters?.length} {course.chapters?.length === 1 ? "chapter" : "chapters"}
            </span>
          </div>
        </div>

        {progressPercentage !== null ? (
          <CourseProgress
            size="sm"
            variant={progressPercentage === 100 ? "success" : "default"}
            value={progressPercentage}
          />
        ) : (
          <p className="text-base font-medium text-slate-700 md:text-sm">
            {course.price ? formatPrice(course.price) : "Free"}
          </p>
        )}
      </div>
    </Link>
  )
}
