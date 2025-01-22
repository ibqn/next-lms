import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { SuccessResponse } from "database/src/types"
import { createAttachment } from "database/src/queries/attachment"
import { createAttachmentSchema } from "database/src/validators/attachment"
import type { User } from "database/src/drizzle/schema/auth"
import type { Attachment } from "database/src/drizzle/schema/attachment"

export const attachmentRoute = new Hono<Context>().post(
  "/",
  signedIn,
  zValidator("json", createAttachmentSchema),
  async (c) => {
    const inputData = c.req.valid("json")
    const user = c.get("user") as User

    const attachments = await createAttachment({
      attachmentsData: inputData,
      user,
    })

    return c.json<SuccessResponse<Attachment[]>>(
      { success: true, message: "Attachments created", data: attachments },
      201
    )
  }
)
