import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { Course } from "database/src/drizzle/schema/course"
import type { SuccessResponse } from "../types"
import { createCourse } from "database/src/queries/course"
import { createCourseSchema } from "database/src/validators/course"
import type { User } from "database/src/drizzle/schema/auth"

export const courseRoute = new Hono<Context>().post(
  "/",
  signedIn,
  zValidator("form", createCourseSchema),
  async (c) => {
    const inputData = c.req.valid("form")
    const user = c.get("user") as User

    const course = await createCourse({ ...inputData, user })

    return c.json<SuccessResponse<Course>>(
      { success: true, message: "Post created", data: course },
      201
    )
  }
)
