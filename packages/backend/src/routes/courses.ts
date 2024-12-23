import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { Course } from "database/src/drizzle/schema/course"
import type { SuccessResponse } from "../types"
import { createCourse, updateCourse } from "database/src/queries/course"
import {
  createCourseSchema,
  updateCourseSchema,
} from "database/src/validators/course"
import type { User } from "database/src/drizzle/schema/auth"
import { paramIdSchema } from "database/src/validators/param"
import { HTTPException } from "hono/http-exception"

export const courseRoute = new Hono<Context>()
  .post("/", signedIn, zValidator("form", createCourseSchema), async (c) => {
    const inputData = c.req.valid("form")
    const user = c.get("user") as User

    const course = await createCourse({ ...inputData, user })

    return c.json<SuccessResponse<Course>>(
      { success: true, message: "Post created", data: course },
      201
    )
  })
  .patch(
    "/:id",
    signedIn,
    zValidator("param", paramIdSchema),
    zValidator("form", updateCourseSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const inputData = c.req.valid("form")
      const user = c.get("user") as User

      const course = await updateCourse({ ...inputData, id, user })

      if (!course) {
        throw new HTTPException(404, { message: "Course not found" })
      }

      return c.json<SuccessResponse<Course>>(
        { success: true, message: "Post updated", data: course },
        200
      )
    }
  )
