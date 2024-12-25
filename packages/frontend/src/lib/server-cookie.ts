"use server"

import { sessionCookieName } from "database/src/cookie"
import { cookies } from "next/headers"

export const getCookieServer = async () => {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(sessionCookieName)?.value
  if (cookieValue) {
    return `${sessionCookieName}=${cookieValue}`
  }
  return null
}
