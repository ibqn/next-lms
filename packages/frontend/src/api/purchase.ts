import type { SuccessResponse } from "database/src/types"
import { axios } from "./axios"
import { queryOptions } from "@tanstack/react-query"
import type { Purchase } from "database/src/drizzle/schema/purchase"
import { ParamIdSchema } from "database/src/validators/param"

export const getPurchaseItem = async (paramId: ParamIdSchema) => {
  const { data: response } = await axios.get<SuccessResponse<Purchase>>(`/purchases/${paramId.id}`)

  if (!response.success) {
    return null
  }
  const { data: purchase } = response

  return purchase
}

export const purchaseQueryOptions = (paramId: ParamIdSchema) =>
  queryOptions({ queryKey: ["purchase", paramId], queryFn: () => getPurchaseItem(paramId) })
