import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { uploadSchema } from "../validators/upload"
import { zValidator } from "@hono/zod-validator"
import type { User } from "database/src/drizzle/schema/auth"
import { HTTPException } from "hono/http-exception"
import { access, unlink, writeFile } from "fs/promises"
import path from "path"
import type { SuccessResponse } from "database/src/types"
import { createUpload, deleteUpload, getUpload } from "database/src/queries/upload"
import type { Upload } from "database/src/drizzle/schema/upload"
import { paramIdSchema } from "database/src/validators/param"
import { createReadStream } from "fs"
import { Readable } from "stream"
import mime from "mime"
import sharp, { type FormatEnum } from "sharp"

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
  .get(":id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")

    const upload = await handleGetUpload(id)

    return c.json<SuccessResponse<Upload>>({
      message: "Upload received",
      data: upload,
      success: true,
    })
  })
  .delete(":id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")
    const user = c.get("user") as User

    const upload = await handleGetUpload(id)

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
    await deleteUpload({ id })

    return c.json<SuccessResponse<Upload>>({
      message: "Upload deleted",
      data: upload,
      success: true,
    })
  })

async function handleGetUpload(id: string) {
  const upload = await getUpload({ id })

  if (!upload) {
    throw new HTTPException(404, { message: "Upload not found" })
  }

  return upload
}

async function handleGetFile(upload: Upload) {
  const filePath = path.join("file-storage", upload.filePath)

  try {
    await access(filePath)
  } catch {
    throw new HTTPException(404, { message: "file not found" })
  }

  const readStream = createReadStream(filePath)
  const stream = Readable.toWeb(readStream) as ReadableStream
  const contentType = mime.getType(filePath)

  if (!contentType) {
    throw new HTTPException(500, { message: "Invalid file type" })
  }

  return { stream, contentType, filePath }
}

function optimizeImage(filePath: string, width?: number, quality?: number, format?: string, contentType?: string) {
  let sharpInstance = sharp(filePath)

  if (width) {
    sharpInstance = sharpInstance.resize(width, null, {
      withoutEnlargement: true,
      fit: "inside",
    })
  }

  if (format) {
    const supportedFormats = ["webp", "jpeg", "jpg", "png", "avif"]

    if (!supportedFormats.includes(format)) {
      throw new HTTPException(400, { message: "Unsupported format" })
    }

    sharpInstance = sharpInstance.toFormat(format as keyof FormatEnum, { quality: quality || 80 })
  } else if (quality && contentType) {
    const formatMap = {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "image/webp": "webp",
    } as const

    const sharpFormat = formatMap[contentType as keyof typeof formatMap]

    if (sharpFormat) {
      sharpInstance = sharpInstance.toFormat(sharpFormat, { quality })
    }
  }

  return sharpInstance
}

export const fileRoute = new Hono<Context>()
  .get(":id/protected", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")

    const upload = await handleGetUpload(id)
    const { stream, contentType } = await handleGetFile(upload)

    return c.body(stream, { headers: { "Content-Type": contentType } })
  })
  .get(":id/public", zValidator("param", paramIdSchema), async (c) => {
    const { id } = c.req.valid("param")

    const upload = await handleGetUpload(id)

    if (!upload.isPublic) {
      throw new HTTPException(403, { message: "Upload is not public" })
    }

    const { stream, contentType } = await handleGetFile(upload)

    return c.body(stream, { headers: { "Content-Type": contentType } })
  })
  .get(":id", signedIn, zValidator("param", paramIdSchema), async (c) => {
    const user = c.get("user")
    const { id } = c.req.valid("param")

    console.log("new endpoint")

    // Get optimization parameters from query
    const width = c.req.query("w") ? parseInt(c.req.query("w") as string) : undefined
    const quality = c.req.query("q") ? parseInt(c.req.query("q") as string) : undefined
    const format = c.req.query("format")

    const upload = await handleGetUpload(id)

    if (!upload.isPublic && !user) {
      throw new HTTPException(403, { message: "Unauthorized" })
    }

    const { stream, contentType, filePath } = await handleGetFile(upload)

    const isImage = contentType.startsWith("image/")
    const shouldOptimize = isImage && (width || quality || format)

    if (!shouldOptimize) {
      return c.body(stream, { headers: { "Content-Type": contentType } })
    }

    const sharpInstance = optimizeImage(filePath, width, quality, format, contentType)
    const optimizedBuffer = await sharpInstance.toBuffer()
    const optimizedContentType = format ? `image/${format}` : contentType

    const optimizedStream = new ReadableStream({
      start(controller) {
        controller.enqueue(optimizedBuffer)
        controller.close()
      },
    })

    return c.body(optimizedStream, {
      headers: {
        "Content-Type": optimizedContentType,
        "Cache-Control": "public, max-age=31536000",
      },
    })
  })
