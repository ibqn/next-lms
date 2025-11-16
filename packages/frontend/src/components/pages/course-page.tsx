"use client"

import { courseQueryOptions } from "@/api/course"
import { useSuspenseQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { IconBadge } from "@/components/icon-badge"
import { CircleDollarSignIcon, FileIcon, LayoutDashboardIcon, ListChecksIcon } from "lucide-react"
import { TitleForm } from "@/components/forms/course/title-form"
import { DescriptionForm } from "@/components/forms/course/description-form"
import { ImageForm } from "@/components/forms/course/image-form"
import { CategoryForm } from "@/components/forms/course/category-form"
import { ChapterForm } from "@/components/forms/course/chapter-form"
import { PriceForm } from "@/components/forms/course/price-form"
import { FileForm } from "@/components/forms/course/file-form"
import { Banner } from "@/components/banner"
import { CourseActions } from "@/components/actions/course-actions"

type Props = {
  courseId: string
}

export const CoursePage = ({ courseId }: Props) => {
  const { data: course } = useSuspenseQuery(courseQueryOptions({ id: courseId }))

  if (!course) {
    notFound()
  }

  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.categoryId,
    course.chapters?.some((chapter) => chapter.isPublished),
  ]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`

  const isCompleted = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is not published yet. It will not be visible to students." variant="warning" />
      )}
      <div className="flex grow flex-col p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl">Course setup</h1>
            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
          </div>

          <CourseActions course={course} disabled={!isCompleted} />
        </div>

        <div className="mt-16 grid grow grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboardIcon} />
              <h2 className="text-xl">Customize your course</h2>
            </div>

            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />

            <CategoryForm initialData={course} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecksIcon} />
              <h2 className="text-xl">Course chapters</h2>
            </div>

            <ChapterForm initialData={course} />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSignIcon} />
              <h2 className="text-xl">Sell your course</h2>
            </div>

            <PriceForm initialData={course} />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={FileIcon} />
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>

            <FileForm initialData={course} />
          </div>
        </div>
      </div>
    </>
  )
}
