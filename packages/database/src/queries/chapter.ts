import { chapterTable, type Chapter } from "../drizzle/schema/chapter"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import {
  reorderChapterSchema,
  type CreateChapterSchema,
  type ReorderChapterSchema,
} from "../validators/chapter"
import { and, desc, eq } from "drizzle-orm"
import { courseTable } from "../drizzle/schema/course"
import { type ParamIdSchema } from "src/validators/param"

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

type ReorderChapterOptions = {
  reorderList: ReorderChapterSchema
  user: User
}

export const reorderChapters = async ({
  reorderList,
  user,
}: ReorderChapterOptions) => {
  const result = reorderChapterSchema.safeParse(reorderList)
  if (!result.success) {
    return null
  }

  const reorderData = result.data.reorderList

  const chapterId = reorderData.at(0)?.id

  if (!chapterId) {
    return null
  }

  const [chapter] = await db
    .select({ courseId: chapterTable.courseId })
    .from(chapterTable)
    .where(eq(chapterTable.id, chapterId))

  if (!chapter) {
    return null
  }

  const [course] = await db
    .select({ id: courseTable.id, userId: courseTable.userId })
    .from(courseTable)
    .where(
      and(eq(courseTable.userId, user.id), eq(courseTable.id, chapter.courseId))
    )

  if (!course) {
    return null
  }

  const trxResult = await db.transaction(async (trx) => {
    const reorderPromises = reorderData.map(({ id, position }) =>
      trx
        .update(chapterTable)
        .set({ position })
        .where(eq(chapterTable.id, id))
        .returning({ id: chapterTable.id })
    )

    const updatedChapters = await Promise.all(reorderPromises)
    return updatedChapters.map(([item]) => item)
  })

  return trxResult
}

export type GetChapterOptions = ParamIdSchema & {
  user: User
}

export const getChapter = async ({
  id: chapterId,
  user,
}: GetChapterOptions) => {
  const [chapter] = await db
    .select({
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
    .from(chapterTable)
    .where(eq(chapterTable.id, chapterId))

  if (!chapter) {
    return null
  }

  const [course] = await db
    .select({ id: courseTable.id })
    .from(courseTable)
    .where(
      and(eq(courseTable.id, chapter.courseId), eq(courseTable.userId, user.id))
    )

  if (!course) {
    return null
  }

  return chapter satisfies Chapter as Chapter
}
