import { cache } from "react"
import { getSessionCookieOptions, sessionCookieName, validateSessionToken, type SessionValidationResult } from "database/src/lucia"
import { cookies } from "next/headers"

export const validateRequest = cache(async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(sessionCookieName)?.value ?? null
  if (!token) {
    return { user: null, session: null }
  }

  const result = await validateSessionToken(token)
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session) {
      cookieStore.set(sessionCookieName, token, getSessionCookieOptions())
    } else {
      cookieStore.delete(sessionCookieName)
    }
  } catch {}
  return result
})
