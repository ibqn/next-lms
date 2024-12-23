import { courseTable, type Course } from "../drizzle/schema/course"
import type { User } from "../drizzle/schema/auth"
import { db } from "../drizzle/db"
import type { CreateCourseSchema } from "../validators/course"

type CreateCourseOptions = CreateCourseSchema & {
  user: User
}
export const createCourse = async ({ title, user }: CreateCourseOptions) => {
  const [course] = await db
    .insert(courseTable)
    .values({
      userId: user.id,
      title,
    })
    .returning({
      id: courseTable.id,
      title: courseTable.title,
      userId: courseTable.userId,
      description: courseTable.description,
      price: courseTable.price,
      imageUrl: courseTable.imageUrl,
      categoryId: courseTable.categoryId,
      isPublished: courseTable.isPublished,
      createdAt: courseTable.createdAt,
      updatedAt: courseTable.updatedAt,
    })

  return { ...course, user } satisfies Course as Course
}

type GetCourseOptions = {
  courseId: string
}

export const getCourse = async ({ courseId }: GetCourseOptions) => {
  const course = await db.query.course.findFirst({
    where: ({ id }, { eq }) => eq(id, courseId),
    with: {
      user: {
        columns: {
          username: true,
          id: true,
          createdAt: true,
        },
      },
    },
  })

  if (!course) {
    return null
  }

  return course satisfies Course as Course
}
