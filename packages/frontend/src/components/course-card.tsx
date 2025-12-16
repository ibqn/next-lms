"use client"

import type { Course } from "database/src/drizzle/schema/course"
import Link from "next/link"
import { Image } from "@/components/optimized-image"
import { IconBadge } from "./icon-badge"
import { BookOpenIcon } from "lucide-react"

type CourseCardProps = {
  course: Course
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link href={`/courses/${course.id}`}>
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

          {}
        </div>
      </div>
    </Link>
  )
}
