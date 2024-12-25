import { env } from "@/lib/env"
import axiosNative from "axios"

console.log("process env api", env.NEXT_PUBLIC_API_URL)
const defaultOptions = {
  baseURL: `${env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
}

export const axios = axiosNative.create(defaultOptions)
