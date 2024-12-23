import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { uploadSchema } from "../validators/upload"
import { zValidator } from "@hono/zod-validator"
import type { User } from "database/src/drizzle/schema/auth"
import { HTTPException } from "hono/http-exception"
import { access, writeFile } from "fs/promises"
import path from "path"
import type { SuccessResponse } from "../types"
import { createUpload, getUpload } from "database/src/queries/upload"
import type { Upload } from "database/src/drizzle/schema/upload"
import { paramIdSchema } from "database/src/validators/param"
import { createReadStream } from "fs"
import { Readable } from "stream"
import mime from "mime"

export const uploadRoute = new Hono<Context>()
  .post("/", signedIn, zValidator("form", uploadSchema), async (c) => {
    const { file, ...uploadData } = c.req.valid("form")
    const user = c.get("user") as User

    if (!(file instanceof File)) {
      throw new HTTPException(400, { message: "Invalid file" })
    }

    const filePath = path.join("file-storage", file.name)
    const buffer = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(buffer))

    console.log("File uploaded", file.name)

    const upload = await createUpload({
      user,
      ...uploadData,
      filePath: file.name,
    })

    return c.json<SuccessResponse<Upload>>({
      message: "File uploaded",
      data: upload,
      success: true,
    })
  })
  .get(
    ":id/protected",
    signedIn,
    zValidator("param", paramIdSchema),
    async (c) => {
      const { id } = c.req.valid("param")

      const upload = await getUpload({ id })

      if (!upload) {
        throw new HTTPException(404, { message: "Upload not found" })
      }

      const filePath = path.join("file-storage", upload.filePath)

      try {
        await access(filePath)
      } catch (error) {
        return new HTTPException(404, { message: "file not found" })
      }

      const readStream = createReadStream(filePath)
      const stream = Readable.toWeb(readStream) as ReadableStream

      const contentType = mime.getType(filePath)

      if (!contentType) {
        throw new HTTPException(500, { message: "Invalid file type" })
      }

      c.header("Content-Type", contentType)
      return c.body(stream)
    }
  )
  .get(":id/public", zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")

    const upload = await getUpload({ id })

    if (!upload) {
      throw new HTTPException(404, { message: "Upload not found" })
    }

    const filePath = path.join("file-storage", upload.filePath)

    try {
      await access(filePath)
    } catch (error) {
      return new HTTPException(404, { message: "file not found" })
    }

    if (!upload.isPublic) {
      throw new HTTPException(403, { message: "Upload is not public" })
    }

    const readStream = createReadStream(filePath)
    const stream = Readable.toWeb(readStream) as ReadableStream

    const contentType = mime.getType(filePath)

    if (!contentType) {
      throw new HTTPException(500, { message: "Invalid file type" })
    }

    c.header("Content-Type", contentType)
    return c.body(stream)
  })
  .get(":id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")

    const upload = await getUpload({ id })

    if (!upload) {
      throw new HTTPException(404, { message: "Upload not found" })
    }

    return c.json<SuccessResponse<Upload>>({
      message: "Upload received",
      data: upload,
      success: true,
    })
  })
