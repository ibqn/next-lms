import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { SuccessResponse } from "../types"
import { createChapter, reorderChapters } from "database/src/queries/chapter"
import {
  createChapterSchema,
  reorderChapterSchema,
} from "database/src/validators/chapter"
import type { User } from "database/src/drizzle/schema/auth"
import type { Chapter } from "database/src/drizzle/schema/chapter"
import { HTTPException } from "hono/http-exception"

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