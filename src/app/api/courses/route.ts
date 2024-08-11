import { db } from "@/db"
import { courses, type NewCourse } from "@/db/schema"
import { courseSchema } from "@/lib/validators/course"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const courseData = await courseSchema.parseAsync(body)

    console.log("[courseData]", courseData)
    const course = await db
      .insert(courses)
      .values(courseData satisfies NewCourse as NewCourse)
      .returning()

    return NextResponse.json(course)
  } catch (error) {
    console.error("[error]", error)
    return new NextResponse("An error occurred", { status: 500 })
  }
}
