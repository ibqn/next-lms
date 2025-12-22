import { and, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import type { Course } from "../drizzle/schema/course"
import { purchaseTable } from "../drizzle/schema/purchase"
import { courseTable } from "../drizzle/schema/course"
import { chapterTable } from "../drizzle/schema/chapter"
import { getCourseProgress, type CourseProgress } from "./user-progress"

type DashboardCoursesProps = {
  userId: User["id"]
}

export type CourseWithProgress = {
  course: Course
  progress: CourseProgress
}

export type DashboardCourses = {
  completedCourses: CourseWithProgress[]
  coursesInProgress: CourseWithProgress[]
}

export const getDashboardCourses = async ({ userId }: DashboardCoursesProps): Promise<DashboardCourses> => {
  const purchasedCourses = await db
    .select()
    .from(purchaseTable)
    .innerJoin(courseTable, eq(purchaseTable.courseId, courseTable.id))
    .where(and(eq(purchaseTable.userId, userId), eq(courseTable.isPublished, true)))

  const completedCourses: CourseWithProgress[] = []
  const coursesInProgress: CourseWithProgress[] = []

  for (const { course } of purchasedCourses) {
    const progress = await getCourseProgress({
      courseId: course.id,
      userId,
    })

    const fullCourse = await db.query.course.findFirst({
      where: eq(courseTable.id, course.id),
      with: {
        category: true,
        chapters: {
          where: eq(chapterTable.isPublished, true),
          orderBy: (chapters, { asc }) => [asc(chapters.position)],
        },
      },
    })

    if (fullCourse) {
      const courseWithProgress: CourseWithProgress = {
        course: fullCourse,
        progress,
      }

      if (progress.progressPercentage === 100) {
        completedCourses.push(courseWithProgress)
      } else {
        coursesInProgress.push(courseWithProgress)
      }
    }
  }

  return {
    completedCourses,
    coursesInProgress,
  }
}
