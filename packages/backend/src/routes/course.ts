import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { Course } from "database/src/drizzle/schema/course"
import { response, type ErrorResponse, type PaginatedSuccessResponse, type SuccessResponse } from "database/src/types"
import {
  createCourse,
  deleteCourse,
  getCourseItem,
  getCourseItems,
  getCourseItemsCount,
  getEditorCourseItem,
  getEditorCourseItems,
  getEditorCourseItemsCount,
  updateCourse,
} from "database/src/queries/course"
import { createCourseSchema, updateCourseSchema } from "database/src/validators/course"
import type { User } from "database/src/drizzle/schema/auth"
import { paramIdSchema } from "database/src/validators/param"
import { HTTPException } from "hono/http-exception"
import { paginationSchema } from "database/src/validators/pagination"
import { courseQuerySchema } from "database/src/validators/course-query"
import { getCategoryId } from "database/src/queries/category"
import { getCourseProgress, type CourseProgress } from "database/src/queries/user-progress"
import { getDashboardCourses, type DashboardCourses } from "database/src/queries/dashboard"

const courseEditorRoute = new Hono<ExtEnv>()
  .post("/", signedIn, zValidator("json", createCourseSchema), async (c) => {
    const inputData = c.req.valid("json")
    const user = c.get("user") as User

    const course = await createCourse({ ...inputData, user })

    return c.json<SuccessResponse<Course>>({ success: true, message: "Course created", data: course }, 201)
  })
  .patch("/:id", signedIn, zValidator("param", paramIdSchema), zValidator("json", updateCourseSchema), async (c) => {
    const { id } = c.req.valid("param")
    const inputData = c.req.valid("json")
    const user = c.get("user") as User

    const course = await updateCourse({ ...inputData, id, user })

    if (!course) {
      throw new HTTPException(404, { message: "Course not found" })
    }

    return c.json<SuccessResponse<Course>>({ success: true, message: "Course updated", data: course }, 200)
  })
  .get("/", signedIn, zValidator("query", paginationSchema), async (c) => {
    const query = c.req.valid("query")
    const { page, limit } = query

    const courseCount = await getEditorCourseItemsCount()
    const courseItems = await getEditorCourseItems(query)

    return c.json<PaginatedSuccessResponse<Course[]>>({
      success: true,
      data: courseItems,
      message: "Course items retrieved",
      pagination: {
        page,
        totalPages: Math.ceil(courseCount / limit),
        totalItems: courseCount,
      },
    })
  })
  .get("/:id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id: courseId } = c.req.valid("param")
    const user = c.get("user") as User

    const courseItem = await getEditorCourseItem({ courseId, userId: user.id })

    if (!courseItem) {
      return c.json<ErrorResponse>({ success: false, error: "Course not found" }, 404)
    }

    return c.json<SuccessResponse<Course>>({
      success: true,
      data: courseItem,
      message: "Course retrieved",
    })
  })
  .delete("/:id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const user = c.get("user") as User
    const { id } = c.req.valid("param")

    const response = await deleteCourse({ id, user })

    if (!response?.id) {
      throw new HTTPException(404, { message: "Could not delete course" })
    }

    return c.json<SuccessResponse<{ id: string }>>({ success: true, message: "Course deleted", data: response }, 200)
  })

const courseExploreRoute = new Hono<ExtEnv>()
  .get("/", signedIn, zValidator("query", paginationSchema.and(courseQuerySchema)), async (c) => {
    const query = c.req.valid("query")
    const { page, limit, category, searchTitle } = query

    let categoryId: string | undefined
    if (category) {
      categoryId = await getCategoryId(category)
    }

    const courseCount = await getCourseItemsCount({ category: categoryId, searchTitle })
    const courseItems = await getCourseItems({ ...query, category: categoryId })

    return c.json<PaginatedSuccessResponse<Course[]>>({
      success: true,
      data: courseItems,
      message: "Course items retrieved",
      pagination: {
        page,
        totalPages: Math.ceil(courseCount / limit),
        totalItems: courseCount,
      },
    })
  })
  .get("/dashboard", signedIn, async (c) => {
    const user = c.get("user") as User

    console.log("Fetching dashboard courses for user:", user.id)

    const dashboardCourses = await getDashboardCourses({ userId: user.id })

    console.log("Dashboard courses:", dashboardCourses)

    return c.json<SuccessResponse<DashboardCourses>>(response("Dashboard courses retrieved", dashboardCourses))
  })
  .get("/:id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id: courseId } = c.req.valid("param")
    const user = c.get("user") as User

    const courseItem = await getCourseItem({ courseId, userId: user.id })

    if (!courseItem) {
      return c.json<ErrorResponse>({ success: false, error: "Course not found" }, 404)
    }

    return c.json<SuccessResponse<Course>>({
      success: true,
      data: courseItem,
      message: "Course retrieved",
    })
  })
  .get("/:id/progress", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id: courseId } = c.req.valid("param")
    const user = c.get("user") as User

    const userProgress = await getCourseProgress({ courseId, userId: user.id })

    return c.json<SuccessResponse<CourseProgress>>(response("Course progress retrieved", userProgress))
  })

export const courseRoute = new Hono<ExtEnv>().route("/editor", courseEditorRoute).route("/", courseExploreRoute)
