import { axios } from "./axios"
import type { SuccessResponse } from "database/src/types"
import type { Upload } from "database/src/drizzle/schema/upload"

export const deleteUpload = async (uploadId: string) => {
  return await axios.delete<SuccessResponse<Upload>>(`/uploads/${uploadId}`)
}
