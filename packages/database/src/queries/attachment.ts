import type { CreateAttachmentSchema } from "../validators/attachment"
import type { User } from "../drizzle/schema/auth"
import { attachmentTable, type Attachment } from "../drizzle/schema/attachment"
import { db } from "../drizzle/db"
import type { ParamIdSchema } from "../validators/param"
import { and, eq } from "drizzle-orm/sql/expressions/conditions"
import unset from "lodash.unset"

type CreateAttachmentOptions = {
  attachmentsData: CreateAttachmentSchema
  user: User
}
export const createAttachment = async ({ attachmentsData, user }: CreateAttachmentOptions): Promise<Attachment[]> => {
  const attachments = await db
    .insert(attachmentTable)
    .values(
      attachmentsData.map((attachment) => ({
        userId: user.id,
        ...attachment,
      }))
    )
    .onConflictDoNothing()
    .returning()

  return attachments satisfies Attachment[]
}

type GetAttachmentOptions = ParamIdSchema & {
  user: User
}

export const getAttachment = async ({ id: attachmentId, user }: GetAttachmentOptions): Promise<Attachment | null> => {
  const attachment = await db.query.attachment.findFirst({
    where: ({ id, userId }, { eq, and }) => and(eq(id, attachmentId), eq(userId, user.id)),
    with: { user: { columns: { passwordHash: false } } },
  })

  unset(attachment, "user.passwordHash")

  if (!attachment) {
    return null
  }

  return attachment satisfies Attachment
}

type DeleteAttachmentOptions = ParamIdSchema & {
  user: User
}

export const deleteAttachment = async ({
  id: attachmentId,
  user,
}: DeleteAttachmentOptions): Promise<{ id: string }> => {
  const [removedItem] = await db
    .delete(attachmentTable)
    .where(and(eq(attachmentTable.id, attachmentId), eq(attachmentTable.userId, user.id)))
    .returning({ id: attachmentTable.id })
  return removedItem
}
