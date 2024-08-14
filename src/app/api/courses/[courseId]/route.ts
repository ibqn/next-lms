import { db } from "@/db"
import { courses } from "@/db/schema"
import { takeFirstOrThrow } from "@/db/utils"
import { courseSchema } from "@/lib/validators/course"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

type Props = {
  params: {
    courseId: string
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { courseId } = params
    const body = await req.json()
    const courseData = await courseSchema.parseAsync(body)

    console.log("[courseData]", courseData)

    const course = await db
      .update(courses)
      .set(courseData)
      .where(eq(courses.id, courseId))
      .returning()

    return NextResponse.json(takeFirstOrThrow(course), { status: 201 })
  } catch (error) {
    console.error("[error]", error)
    return new NextResponse("An error occurred", { status: 500 })
  }
}
