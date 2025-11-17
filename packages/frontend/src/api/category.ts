import { SuccessResponse } from "database/src/types"
import { Category } from "database/src/drizzle/schema/category"
import { axios } from "./axios"
import { queryOptions } from "@tanstack/react-query"

export const getCategories = async () => {
  const { data: response } = await axios.get<SuccessResponse<Category[]>>("/categories")

  if (!response.success) {
    return null
  }
  const { data: categories } = response

  return categories
}

export const categoryQueryOptions = () => queryOptions({ queryKey: ["categories"], queryFn: getCategories })
