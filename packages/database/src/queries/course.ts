import { courseTable, type Course } from "../drizzle/schema/course"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import type { CreateCourseSchema, UpdateCourseSchema } from "../validators/course"
import { asc, countDistinct, desc, eq } from "drizzle-orm"
import type { ParamIdSchema } from "../validators/param"
import unset from "lodash.unset"
import { paginationSchema, type PaginationSchema, type SortedBySchema } from "../validators/pagination"

type CreateCourseOptions = CreateCourseSchema & {
  user: User
}

export const createCourse = async ({ title, user }: CreateCourseOptions): Promise<Course> => {
  const [course] = await db.insert(courseTable).values({ userId: user.id, title }).returning()

  return { ...course, user } satisfies Course
}

type GetCourseOptions = {
  courseId: string
  userId: User["id"]
}

export const getCourseItem = async ({ courseId, userId }: GetCourseOptions): Promise<Course | null> => {
  const course = await db.query.course.findFirst({
    where: ({ id, userId: courseUserId }, { eq, and }) => and(eq(id, courseId), eq(courseUserId, userId)),
    with: {
      user: { columns: { passwordHash: false } },
      chapters: {
        orderBy: (chapters, { asc }) => [asc(chapters.position)],
      },
      attachments: true,
    },
  })

  if (!course) {
    return null
  }

  unset(course, "user.passwordHash")

  return course satisfies Course
}

type UpdateCourseOptions = UpdateCourseSchema &
  ParamIdSchema & {
    user: User
  }

export const updateCourse = async ({ id, user: { id: userId }, ...data }: UpdateCourseOptions): Promise<Course> => {
  const [course] = await db
    .update(courseTable)
    .set({ ...data, userId })
    .where(eq(courseTable.id, id))
    .returning()

  const user =
    (await db.query.user.findFirst({
      where: ({ id }, { eq }) => eq(id, userId),
      columns: { passwordHash: false },
    })) ?? null

  unset(user, "passwordHash")

  return { ...course, user } satisfies Course
}

export const getCourseItemsCount = async () => {
  const [{ count }] = await db.select({ count: countDistinct(courseTable.id) }).from(courseTable)

  return count
}

const getSortedByColumn = (sortedBy: SortedBySchema) => {
  switch (sortedBy) {
    case "title":
      return courseTable.title
    case "recent":
      return courseTable.createdAt
    default:
      throw new Error("Invalid sortedBy value")
  }
}

export const getCourseItems = async (queryParams: Partial<PaginationSchema> = {}): Promise<Course[]> => {
  const params = paginationSchema.parse(queryParams)

  const { limit, page, sortedBy, order } = params
  const offset = (page - 1) * limit

  const sortedByColumn = getSortedByColumn(sortedBy)
  const orderBy = order === "desc" ? desc(sortedByColumn) : asc(sortedByColumn)

  const courseItems = await db.query.course.findMany({
    offset,
    limit,
    orderBy: [orderBy, asc(courseTable.id)],
    with: {
      category: true,
      user: { columns: { passwordHash: false } },
      chapters: true,
      attachments: true,
    },
  })

  return courseItems satisfies Course[]
}
