import { chapterTable, type Chapter } from "../drizzle/schema/chapter"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import type { CreateChapterSchema } from "../validators/chapter"
import { and, desc, eq } from "drizzle-orm"
import { courseTable } from "../drizzle/schema/course"

type CreateChapterOptions = CreateChapterSchema & {
  user: User
}

export const createChapter = async ({
  title,
  courseId,
  user,
}: CreateChapterOptions) => {
  const [course] = await db
    .select({ id: courseTable.id, userId: courseTable.userId })
    .from(courseTable)
    .where(and(eq(courseTable.userId, user.id), eq(courseTable.id, courseId)))

  console.log("course", course)

  if (!course) {
    return null
  }

  const [lastChapter] = await db
    .select({ position: chapterTable.position })
    .from(chapterTable)
    .where(eq(chapterTable.courseId, courseId))
    .orderBy(desc(chapterTable.position))
    .limit(1)

  const [chapter] = await db
    .insert(chapterTable)
    .values({
      courseId,
      position: (lastChapter?.position ?? 0) + 1,
      title,
    })
    .returning({
      id: chapterTable.id,
      title: chapterTable.title,
      description: chapterTable.description,
      courseId: chapterTable.courseId,
      isPublished: chapterTable.isPublished,
      videoUrl: chapterTable.videoUrl,
      isFree: chapterTable.isFree,
      position: chapterTable.position,
      createdAt: chapterTable.createdAt,
      updatedAt: chapterTable.updatedAt,
    })

  return { ...chapter } satisfies Chapter as Chapter
}
