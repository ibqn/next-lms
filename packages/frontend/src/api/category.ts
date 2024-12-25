import { SuccessResponse } from "backend/src/types"
import { Category } from "database/src/drizzle/schema/category"
import { axios } from "./axios"
import { queryOptions } from "@tanstack/react-query"

export const getCategories = async () => {
  const response = await axios.get<SuccessResponse<Category[]>>("/categories")

  return response.data
}

export const categoryQueryOptions = () => queryOptions({ queryKey: ["categories"], queryFn: getCategories })
