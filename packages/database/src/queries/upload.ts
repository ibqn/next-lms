import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import type { CreateUploadSchema } from "../validators/upload"
import { uploadTable, type Upload } from "../drizzle/schema/upload"
import type { ParamIdSchema } from "../validators/param"
import { eq } from "drizzle-orm"

type CreateUploadOptions = CreateUploadSchema & {
  user: User
}

export const createUpload = async ({
  user,
  ...uploadData
}: CreateUploadOptions) => {
  const [upload] = await db
    .insert(uploadTable)
    .values({
      ...uploadData,
      userId: user.id,
    })
    .returning({
      id: uploadTable.id,
      description: uploadTable.description,
      isPublic: uploadTable.isPublic,
      filePath: uploadTable.filePath,
      userId: uploadTable.userId,
      createdAt: uploadTable.createdAt,
      updatedAt: uploadTable.updatedAt,
    })

  return { ...upload, user } satisfies Upload as Upload
}

type GetUploadOptions = ParamIdSchema

export const getUpload = async ({ id: uploadId }: GetUploadOptions) => {
  const upload = await db.query.upload.findFirst({
    where: ({ id }, { eq }) => eq(id, uploadId),
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

  if (!upload) {
    return null
  }

  return upload satisfies Upload as Upload
}

type DeleteUploadOptions = ParamIdSchema

export const deleteUpload = async ({ id: uploadId }: DeleteUploadOptions) => {
  return await db.delete(uploadTable).where(eq(uploadTable.id, uploadId))
}
