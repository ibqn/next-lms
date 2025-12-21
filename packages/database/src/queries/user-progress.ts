import { and, eq } from "drizzle-orm"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import { chapterTable, type Chapter } from "../drizzle/schema/chapter"
import { userProgressTable, type UserProgress } from "../drizzle/schema/user-progress"
import type { Course } from "../drizzle/schema/course"
import type { ProgressChapterSchema } from "../validators/chapter"

type GetUserProgressOptions = {
  courseId: Course["id"]
  userId: User["id"]
}

export const getCourseProgress = async ({ courseId, userId }: GetUserProgressOptions) => {
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
        eq(userProgressTable.userId, userId),
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

export type CourseProgress = Awaited<ReturnType<typeof getCourseProgress>>

type ToggleChapterProgressOptions = {
  chapterId: Chapter["id"]
  userId: User["id"]
} & ProgressChapterSchema

export const toggleChapterProgress = async ({
  chapterId,
  userId,
  isCompleted,
}: ToggleChapterProgressOptions): Promise<UserProgress | null> => {
  const [chapter] = await db.select().from(chapterTable).where(eq(chapterTable.id, chapterId))

  if (!chapter) {
    return null
  }

  const purchase = await db.query.purchase.findFirst({
    where: (purchase, { eq, and }) => and(eq(purchase.courseId, chapter.courseId), eq(purchase.userId, userId)),
  })

  if (!purchase) {
    return null
  }

  const [userProgress] = await db
    .insert(userProgressTable)
    .values({
      userId,
      chapterId,
      isCompleted,
    })
    .onConflictDoUpdate({
      target: [userProgressTable.userId, userProgressTable.chapterId],
      set: { isCompleted },
    })
    .returning()

  return userProgress satisfies UserProgress
}
