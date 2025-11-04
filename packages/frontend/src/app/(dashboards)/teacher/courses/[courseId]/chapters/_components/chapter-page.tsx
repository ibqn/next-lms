"use client"

import { chapterQueryOptions } from "@/api/chapter"
import { DescriptionForm } from "@/components/forms/chapter/description-form"
import { TitleForm } from "@/components/forms/chapter/title-form"
import { IconBadge } from "@/components/icon-badge"
import { useSuspenseQuery } from "@tanstack/react-query"
import { LayoutDashboardIcon } from "lucide-react"

type Props = {
  chapterId: string
}

export const ChapterPage = ({ chapterId }: Props) => {
  const { data: chapter } = useSuspenseQuery(chapterQueryOptions(chapterId))

  if (chapter === null) {
    return <div>Not found</div>
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionStats = `(${completedFields}/${totalFields})`

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Chapter Creation</h1>
          <span className="text-sm text-slate-700">Complete all fields {completionStats}</span>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboardIcon} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
          </div>

          <TitleForm initialData={chapter} />
          <DescriptionForm initialData={chapter} />
        </div>
      </div>
    </>
  )
}
