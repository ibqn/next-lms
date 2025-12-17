"use client"

import { cn } from "@/lib/utils"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { CheckCircleIcon, LockIcon, PlayCircleIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

type CourseSidebarChapterProps = {
  chapter: Chapter
  isCompleted: boolean
}

export const CourseSidebarChapter = ({ chapter, isCompleted }: CourseSidebarChapterProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const isLocked = !chapter.isFree

  const Icon = isLocked ? LockIcon : isCompleted ? CheckCircleIcon : PlayCircleIcon

  const isActive = pathname.includes(chapter.id)

  const handleClick = () => {
    router.push(`/course/${chapter.courseId}/chapter/${chapter.id}`)
  }

  console.log("chapter:", chapter)

  return (
    <button
      onClick={handleClick}
      className={cn(
        `flex items-center gap-x-2 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20
        hover:text-slate-600`,
        isActive && "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-slate-700", isCompleted && "text-emerald-700")}
        />
        <span>{chapter.title}</span>
      </div>
      <div
        className={cn(
          "ml-auto h-full border-2 border-slate-700 opacity-0 transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  )
}
