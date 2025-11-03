import { columns } from "@/components/columns/course"
import { DataTable } from "@/components/data-table/course"
import { buttonVariants } from "@/components/ui/button"
import { getCourseItems } from "database/src/queries/course"
import Link from "next/link"

export default async function CoursesPage() {
  const courseItems = await getCourseItems()

  console.log("courseItems", courseItems)

  return (
    <div className="p-6">
      <Link href="/teacher/create" className={buttonVariants()}>
        New Course
      </Link>
      <div className="py-10">
        <DataTable columns={columns} data={courseItems} />
      </div>
    </div>
  )
}
