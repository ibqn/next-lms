import { and, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import { chapterTable } from "../drizzle/schema/chapter"
import { userProgressTable } from "../drizzle/schema/user-progress"

type GetUserProgressOptions = {
  courseId: string
  user: User
}

export const getCourseProgress = async ({ courseId, user }: GetUserProgressOptions) => {
  const publishedChapters = await db
    .select()
    .from(chapterTable)
    .where(and(eq(chapterTable.courseId, courseId), eq(chapterTable.isPublished, true)))
    .orderBy(chapterTable.position)

  const completedChapters = await db
    .select({ id: chapterTable.id })
    .from(userProgressTable)
    .innerJoin(chapterTable, eq(userProgressTable.chapterId, chapterTable.id))
    .where(
      and(
        eq(userProgressTable.userId, user.id),
        eq(chapterTable.courseId, courseId),
        eq(userProgressTable.isCompleted, true)
      )
    )

  const progressPercentage =
    publishedChapters.length === 0 ? 0 : Math.round((completedChapters.length / publishedChapters.length) * 100)

  return {
    completedChapters,
    totalChapters: publishedChapters.length,
    progressPercentage,
  }
}
