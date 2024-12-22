import type { SigninSchema } from "database/src/validators/signin"
import { axios } from "./axios"
import type { SuccessResponse } from "backend/src/types"
import { queryOptions } from "@tanstack/react-query"
import type { User } from "database/src/drizzle/schema/auth"

export const postSignup = async (formData: SigninSchema) => {
  return axios.post<SuccessResponse<User>>("/auth/signup", formData)
}

export const postSignin = async (formData: SigninSchema) => {
  return axios.post<SuccessResponse<User>>("/auth/signin", formData)
}

export const getSignout = async () => {
  return axios.get("/auth/signout")
}

export const getUser = async () => {
  const { data: response } = await axios.get<SuccessResponse<User>>("/auth/user")
  const { data: user } = response
  return user
}

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
  })
