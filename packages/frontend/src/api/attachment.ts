import type { CreateAttachmentSchema } from "database/src/validators/attachment"
import { axios } from "./axios"
import type { SuccessResponse } from "backend/src/types"
import { Attachment } from "database/src/drizzle/schema/attachment"

export const postAttachment = async (attachmentData: CreateAttachmentSchema) => {
  const response = await axios.post<SuccessResponse<Attachment>>("/attachments", attachmentData)
  return response.data
}
