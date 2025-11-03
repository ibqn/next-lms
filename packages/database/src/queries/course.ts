import { courseTable, type Course } from "../drizzle/schema/course"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import type {
  CreateCourseSchema,
  UpdateCourseSchema,
} from "../validators/course"
import { eq } from "drizzle-orm"
import type { ParamIdSchema } from "../validators/param"
import unset from "lodash.unset"

type CreateCourseOptions = CreateCourseSchema & {
  user: User
}

export const createCourse = async ({ title, user }: CreateCourseOptions) => {
  const [course] = await db
    .insert(courseTable)
    .values({ userId: user.id, title })
    .returning()

  return { ...course, user } satisfies Course as Course
}

type GetCourseOptions = {
  courseId: string
}

export const getCourse = async ({ courseId }: GetCourseOptions) => {
  const course = await db.query.course.findFirst({
    where: ({ id }, { eq }) => eq(id, courseId),
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

  return course satisfies Course as Course
}

type UpdateCourseOptions = UpdateCourseSchema &
  ParamIdSchema & {
    user: User
  }

export const updateCourse = async ({
  id,
  user: { id: userId },
  ...data
}: UpdateCourseOptions): Promise<Course> => {
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
