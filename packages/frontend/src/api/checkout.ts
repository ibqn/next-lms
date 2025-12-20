import { axios } from "./axios"
import type { SuccessResponse } from "database/src/types"
import { ParamIdSchema } from "database/src/validators/param"

export const postCheckout = async ({ id: courseId }: ParamIdSchema): Promise<{ url: string } | null> => {
  const { data: response } = await axios.post<SuccessResponse<{ url: string }>>(`/stripe/checkout/${courseId}`)

  if (!response.success) {
    return null
  }
  const { data } = response

  return data
}
