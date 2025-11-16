"use client"

import { chapterQueryOptions } from "@/api/chapter"
import { AccessForm } from "@/components/forms/chapter/access-form"
import { DescriptionForm } from "@/components/forms/chapter/description-form"
import { TitleForm } from "@/components/forms/chapter/title-form"
import { VideoForm } from "@/components/forms/chapter/video-form"
import { IconBadge } from "@/components/icon-badge"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ArrowLeftIcon, EyeIcon, LayoutDashboardIcon, VideoIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Banner } from "@/components/banner"
import { ChapterActions } from "@/components/actions/chapter-actions"

type Props = {
  chapterId: string
}

export const ChapterPage = ({ chapterId }: Props) => {
  const { data: chapter } = useSuspenseQuery(chapterQueryOptions({ id: chapterId }))

  if (chapter === null) {
    return notFound()
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionStats = `(${completedFields}/${totalFields})`

  const isCompleted = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished && (
        <Banner label="This chapter is not published yet. It will not be visible in the course." variant="warning" />
      )}

      <div className="flex grow flex-col p-6">
        <div className="mb-4 flex">
          <Link href={`/teacher/courses/${chapter.courseId}`} className="flex items-center text-sm hover:opacity-75">
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to course setup
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Chapter Creation</h1>
            <span className="text-sm text-slate-700">Complete all fields {completionStats}</span>
          </div>

          <ChapterActions chapter={chapter} disabled={!isCompleted} />
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

          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={EyeIcon} />
              <h2 className="text-xl">Access Settings</h2>
            </div>

            <AccessForm initialData={chapter} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={VideoIcon} />
              <h2 className="text-xl">Add a Video</h2>
            </div>

            <VideoForm initialData={chapter} />
          </div>
        </div>
      </div>
    </>
  )
}
