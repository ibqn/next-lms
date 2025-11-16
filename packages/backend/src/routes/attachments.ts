import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { SuccessResponse } from "database/src/types"
import { createAttachment, deleteAttachment, getAttachment } from "database/src/queries/attachment"
import { createAttachmentSchema } from "database/src/validators/attachment"
import type { User } from "database/src/drizzle/schema/auth"
import type { Attachment } from "database/src/drizzle/schema/attachment"
import { paramIdSchema } from "database/src/validators/param"
import { HTTPException } from "hono/http-exception"
import path from "path"
import { access, unlink } from "fs/promises"
import { deleteUpload, getUpload } from "database/src/queries/upload"

export const attachmentRoute = new Hono<Context>()
  .post("/", signedIn, zValidator("json", createAttachmentSchema), async (c) => {
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
  })
  .delete(":id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")
    const user = c.get("user") as User

    const attachment = await getAttachment({ id, user })

    if (!attachment) {
      throw new HTTPException(404, { message: "Attachment not found" })
    }

    if (attachment.userId !== user.id) {
      throw new HTTPException(403, { message: "Unauthorized" })
    }

    const deletedAttachment = await deleteAttachment({ id, user })

    const uploadId = attachment.url.split("/").pop()

    if (!uploadId) {
      throw new HTTPException(404, { message: "Upload ID not found in attachment URL" })
    }

    const upload = await getUpload({ id: uploadId })

    if (!upload) {
      throw new HTTPException(404, { message: "Associated upload not found" })
    }

    if (upload.userId !== user.id) {
      throw new HTTPException(403, { message: "Unauthorized" })
    }

    const filePath = path.join("file-storage", upload.filePath)

    try {
      await access(filePath)
    } catch {
      throw new HTTPException(404, { message: "file not found" })
    }

    await unlink(filePath)
    await deleteUpload({ id: uploadId })

    return c.json<SuccessResponse<{ id: string }>>({
      message: "Attachment deleted",
      data: deletedAttachment,
      success: true,
    })
  })
