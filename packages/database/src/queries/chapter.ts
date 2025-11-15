import { chapterTable, type Chapter } from "../drizzle/schema/chapter"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import {
  reorderChapterSchema,
  type CreateChapterSchema,
  type ReorderChapterSchema,
  type UpdateChapterSchema,
} from "../validators/chapter"
import { and, desc, eq } from "drizzle-orm"
import { courseTable } from "../drizzle/schema/course"
import { type ParamIdSchema } from "../validators/param"
import postgres from "postgres"
import type { ApiResponse } from "../types"

type CreateChapterOptions = CreateChapterSchema & {
  user: User
}

export const createChapter = async ({ title, courseId, user }: CreateChapterOptions) => {
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
    .returning()

  return { ...chapter } satisfies Chapter as Chapter
}

type ReorderChapterOptions = {
  reorderList: ReorderChapterSchema
  user: User
}

export const reorderChapters = async ({ reorderList, user }: ReorderChapterOptions) => {
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
    .where(and(eq(courseTable.userId, user.id), eq(courseTable.id, chapter.courseId)))

  if (!course) {
    return null
  }

  const trxResult = await db.transaction(async (trx) => {
    const reorderPromises = reorderData.map(({ id, position }) =>
      trx.update(chapterTable).set({ position }).where(eq(chapterTable.id, id)).returning({ id: chapterTable.id })
    )

    const updatedChapters = await Promise.all(reorderPromises)
    return updatedChapters.map(([item]) => item)
  })

  return trxResult
}

export type GetChapterOptions = ParamIdSchema & {
  user: User
}

export const getChapter = async ({ id: chapterId, user }: GetChapterOptions) => {
  const [chapter] = await db.select().from(chapterTable).where(eq(chapterTable.id, chapterId))

  if (!chapter) {
    return null
  }

  const [course] = await db
    .select({ id: courseTable.id })
    .from(courseTable)
    .where(and(eq(courseTable.id, chapter.courseId), eq(courseTable.userId, user.id)))

  if (!course) {
    return null
  }

  return chapter satisfies Chapter as Chapter
}

type UpdateChapterOptions = UpdateChapterSchema &
  ParamIdSchema & {
    user: User
  }

export const updateChapter = async ({
  id: chapterId,
  user,
  ...data
}: UpdateChapterOptions): Promise<ApiResponse<Chapter>> => {
  const [chapter] = await db
    .select({ courseId: chapterTable.courseId })
    .from(chapterTable)
    .where(eq(chapterTable.id, chapterId))

  if (!chapter) {
    return { success: false, error: "Chapter not found" }
  }

  const [course] = await db
    .select({ id: courseTable.id, userId: courseTable.userId })
    .from(courseTable)
    .where(and(eq(courseTable.userId, user.id), eq(courseTable.id, chapter.courseId)))

  if (!course) {
    return { success: false, error: "Not authorized to update chapter" }
  }

  try {
    const [chapter] = await db.update(chapterTable).set(data).where(eq(chapterTable.id, chapterId)).returning()

    return {
      data: chapter satisfies Chapter as Chapter,
      success: true,
      message: "Chapter updated",
    }
  } catch (error) {
    console.error(error)
    if (error instanceof postgres.PostgresError && error.code === "23505") {
      return { success: false, error: "Chapter with this title already exists" }
    }
    return { success: false, error: "Failed to update chapter" }
  }
}
