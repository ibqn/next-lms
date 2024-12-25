import { categoryQueryOptions } from "@/api/category"
import { CategoryForm } from "@/components/category-form"
import { DescriptionForm } from "@/components/description-form"
import { IconBadge } from "@/components/icon-badge"
import { ImageForm } from "@/components/image-form"
import { PriceForm } from "@/components/price-form"
import { TitleForm } from "@/components/title-form"
import { getQueryClient } from "@/lib/query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getCourse } from "database/src/queries/course"
import { CircleDollarSignIcon, LayoutDashboardIcon, ListChecksIcon } from "lucide-react"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    courseId: string
  }>
}

export default async function SingleCoursePage({ params }: Props) {
  const { courseId } = await params

  const course = await getCourse({ courseId })

  if (!course) {
    notFound()
  }

  const requiredFields = [course.title, course.description, course.price, course.categoryId]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(categoryQueryOptions())

  return (
    <div className="flex grow flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl">Course setup</h1>
          <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
        </div>
      </div>

      <div className="mt-16 grid grow grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboardIcon} />
            <h2 className="text-xl">Customize your course</h2>
          </div>

          <TitleForm initialData={course} />
          <DescriptionForm initialData={course} />
          <ImageForm initialData={course} />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoryForm initialData={course} />
          </HydrationBoundary>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecksIcon} />
            <h2 className="text-xl">Course chapters</h2>
          </div>

          <div>TODO: chapters</div>

          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSignIcon} />
            <h2 className="text-xl">Sell your course</h2>
          </div>

          <PriceForm initialData={course} />
        </div>
      </div>
    </div>
  )
}
