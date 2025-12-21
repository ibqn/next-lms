import { courseTable, type Course } from "../drizzle/schema/course"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import type { CreateCourseSchema, UpdateCourseSchema } from "../validators/course"
import { and, asc, countDistinct, desc, eq, ilike } from "drizzle-orm"
import type { ParamIdSchema } from "../validators/param"
import unset from "lodash.unset"
import { paginationSchema, type PaginationSchema, type SortedBySchema } from "../validators/pagination"
import { courseQuerySchema, type CourseQuerySchema } from "../validators/course-query"
import { chapterTable } from "../drizzle/schema/chapter"

type CreateCourseOptions = CreateCourseSchema & {
  user: User
}

export const createCourse = async ({ title, user }: CreateCourseOptions): Promise<Course> => {
  const [course] = await db.insert(courseTable).values({ userId: user.id, title }).returning()
  return { ...course, user } satisfies Course
}

type GetDashboardCourseOptions = {
  courseId: Course["id"]
  userId: User["id"]
}

export const getDashboardCourseItem = async ({
  courseId,
  userId,
}: GetDashboardCourseOptions): Promise<Course | null> => {
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

type GetCourseOptions = {
  courseId: Course["id"]
  userId: User["id"]
}

export const getCourseItem = async ({ courseId, userId }: GetCourseOptions): Promise<Course | null> => {
  const course = await db.query.course.findFirst({
    where: ({ id, userId: courseUserId }, { eq, and }) => and(eq(id, courseId), eq(courseUserId, userId)),
    with: {
      user: { columns: { passwordHash: false } },
      chapters: {
        orderBy: (chapters, { asc }) => [asc(chapters.position)],
        where: eq(chapterTable.isPublished, true),
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

export const getDashboardCourseItemsCount = async () => {
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

export const getDashboardCourseItems = async (queryParams?: PaginationSchema): Promise<Course[]> => {
  const params = paginationSchema.parse(queryParams ?? {})

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

type DeleteCourseOptions = ParamIdSchema & {
  user: User
}

export const deleteCourse = async ({ id: courseId, user }: DeleteCourseOptions): Promise<{ id: string } | null> => {
  const [course] = await db
    .delete(courseTable)
    .where(and(eq(courseTable.id, courseId), eq(courseTable.userId, user.id)))
    .returning()

  if (!course) {
    return null
  }

  return { id: course.id }
}

export const getCourseItemsCount = async (searchQuery?: CourseQuerySchema) => {
  const params = courseQuerySchema.parse(searchQuery ?? {})

  const conditions = [eq(courseTable.isPublished, true)]

  if (params.searchTitle) {
    conditions.push(ilike(courseTable.title, `%${params.searchTitle}%`))
  }

  if (params.category) {
    conditions.push(eq(courseTable.categoryId, params.category))
  }

  const [{ count }] = await db
    .select({ count: countDistinct(courseTable.id) })
    .from(courseTable)
    .where(and(...conditions))

  return count
}

export const getCourseItems = async (queryParams?: CourseQuerySchema & PaginationSchema): Promise<Course[]> => {
  const params = paginationSchema.and(courseQuerySchema).parse(queryParams ?? {})

  const { limit, page, sortedBy, order, category, searchTitle } = params
  const offset = (page - 1) * limit

  const sortedByColumn = getSortedByColumn(sortedBy)
  const orderBy = order === "desc" ? desc(sortedByColumn) : asc(sortedByColumn)

  const conditions = [eq(courseTable.isPublished, true)]

  if (searchTitle) {
    conditions.push(ilike(courseTable.title, `%${searchTitle}%`))
  }

  if (category) {
    conditions.push(eq(courseTable.categoryId, category))
  }

  const courseItems = await db.query.course.findMany({
    where: and(...conditions),
    offset,
    limit,
    orderBy: [orderBy, asc(courseTable.id)],
    with: {
      user: { columns: { passwordHash: false } },
      category: true,
      chapters: { where: eq(chapterTable.isPublished, true) },
    },
  })

  return courseItems satisfies Course[]
}
