import { IconBadge } from "@/components/icon-badge"
import { TitleForm } from "@/components/title-form"
import { db } from "@/db"
import { courses } from "@/db/schema"
import { eq } from "drizzle-orm"
import { LayoutDashboard } from "lucide-react"
import { notFound } from "next/navigation"

type Props = {
  params: {
    courseId: string
  }
}

export default async function SingleCoursePage({ params }: Props) {
  const { courseId } = params

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  })

  if (!course) {
    notFound()
  }

  const requiredFields = [
    course.title,
    course.description,
    course.price,
    course.categoryId,
  ]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `(${completedFields}/${totalFields})`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2>Customize your course</h2>
          </div>

          <TitleForm initialData={course} />
        </div>
      </div>
    </div>
  )
}
