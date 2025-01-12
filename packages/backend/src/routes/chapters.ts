import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import { type SuccessResponse } from "../types"
import {
  createChapter,
  reorderChapters,
  getChapter,
} from "database/src/queries/chapter"
import { updateChapter } from "database/src/queries/chapter"
import {
  createChapterSchema,
  reorderChapterSchema,
  updateChapterSchema,
} from "database/src/validators/chapter"
import type { User } from "database/src/drizzle/schema/auth"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { HTTPException } from "hono/http-exception"
import { paramIdSchema } from "database/src/validators/param"

export const chapterRoute = new Hono<Context>()
  .post("/", signedIn, zValidator("json", createChapterSchema), async (c) => {
    const inputData = c.req.valid("json")
    const user = c.get("user") as User

    const chapter = await createChapter({ ...inputData, user })

    if (!chapter) {
      throw new HTTPException(404, { message: "Course not found" })
    }

    return c.json<SuccessResponse<Chapter>>(
      { success: true, message: "Chapter created", data: chapter },
      201
    )
  })
  .post(
    "/reorder",
    signedIn,
    zValidator("json", reorderChapterSchema),
    async (c) => {
      const reorderList = c.req.valid("json")
      const user = c.get("user") as User

      const reorderedChapters = await reorderChapters({ reorderList, user })

      if (!reorderedChapters) {
        throw new HTTPException(404, { message: "No chapters reordered" })
      }

      return c.json<SuccessResponse<{ id: string }[]>>({
        success: true,
        message: "Chapter reordered",
        data: reorderedChapters,
      })
    }
  )
  .get("/:id", zValidator("param", paramIdSchema), signedIn, async (c) => {
    const { id } = c.req.valid("param")
    const user = c.get("user") as User

    const chapter = await getChapter({ id, user })

    if (!chapter) {
      throw new HTTPException(404, { message: "Chapter not found" })
    }

    return c.json<SuccessResponse<Chapter>>({
      success: true,
      message: "Chapter found",
      data: chapter,
    })
  })
  .patch(
    "/:id",
    signedIn,
    zValidator("param", paramIdSchema),
    zValidator("json", updateChapterSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const inputData = c.req.valid("json")

      const response = await updateChapter({ ...inputData, id })

      if (!response.success) {
        throw new HTTPException(404, { message: response.error })
      }

      return c.json<SuccessResponse<Chapter>>(response, 200)
    }
  )
