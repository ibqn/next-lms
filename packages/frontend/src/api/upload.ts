import { axios } from "./axios"
import type { SuccessResponse } from "backend/src/types"
import { Upload } from "database/src/drizzle/schema/upload"

export const deleteUpload = async (uploadId: string) => {
  return await axios.delete<SuccessResponse<Upload>>(`/uploads/${uploadId}`)
}
