import { axios } from "./axios"
import type { SuccessResponse } from "database/src/types"
import type { Upload } from "database/src/drizzle/schema/upload"

export const deleteUpload = async (uploadId: string) => {
  const { data: response } = await axios.delete<SuccessResponse<Upload>>(`/uploads/${uploadId}`)

  if (!response.success) {
    return null
  }

  const { data: deletedUpload } = response
  return deletedUpload
}
