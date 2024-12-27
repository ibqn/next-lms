import type { CreateAttachmentSchema } from "src/validators/attachment"
import type { User } from "../drizzle/schema/auth"
import { attachmentTable, type Attachment } from "../drizzle/schema/attachment"
import { db } from "../drizzle/db"

type CreateAttachmentOptions = {
  attachmentsData: CreateAttachmentSchema
  user: User
}
export const createAttachment = async ({
  attachmentsData,
  user,
}: CreateAttachmentOptions) => {
  const attachments = await db
    .insert(attachmentTable)
    .values(
      attachmentsData.map((attachment) => ({
        userId: user.id,
        ...attachment,
      }))
    )
    .onConflictDoNothing()
    .returning({
      id: attachmentTable.id,
      name: attachmentTable.name,
      url: attachmentTable.url,
      courseId: attachmentTable.courseId,
      userId: attachmentTable.userId,
      createdAt: attachmentTable.createdAt,
      updatedAt: attachmentTable.updatedAt,
    })

  return attachments satisfies Attachment[] as Attachment[]
}
