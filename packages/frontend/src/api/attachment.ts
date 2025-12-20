import type { CreateAttachmentSchema } from "database/src/validators/attachment"
import { axios } from "./axios"
import type { SuccessResponse } from "database/src/types"
import type { Attachment } from "database/src/drizzle/schema/attachment"

export const postAttachment = async (attachmentData: CreateAttachmentSchema) => {
  const response = await axios.post<SuccessResponse<Attachment>>("/attachments", attachmentData)
  return response.data
}

export const deleteAttachment = async (attachmentId: string) => {
  const { data: response } = await axios.delete<SuccessResponse<{ id: string }>>(`/attachments/${attachmentId}`)

  if (!response.success) {
    return null
  }
  const { data: deletedAttachment } = response
  return deletedAttachment
}
