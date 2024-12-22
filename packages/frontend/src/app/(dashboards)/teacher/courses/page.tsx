import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function CoursesPage() {
  return (
    <div className="p-6">
      <Link href="/teacher/create" className={buttonVariants({})}>
        New Course
      </Link>
    </div>
  )
}
