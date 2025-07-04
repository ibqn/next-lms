import { cache } from "react"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import type { SessionValidationResult } from "database/src/lucia"
import { cookies } from "next/headers"
import { axios } from "./api/axios"
import type { SuccessResponse } from "database/src/types"

export const validateRequest = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies()
    const token = cookieStore.get(sessionCookieName)?.value ?? null
    if (!token) {
      return { user: null, session: null }
    }

    let result: SessionValidationResult = { user: null, session: null }
    try {
      const { data: response } = await axios.get<
        SuccessResponse<SessionValidationResult>
      >("/auth/validate")
      result = response.data
    } catch (error) {
      console.error(error)
    }

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session) {
        cookieStore.set(sessionCookieName, token, getSessionCookieOptions())
      } else {
        cookieStore.delete(sessionCookieName)
      }
    } catch {}
    return result
  }
)
