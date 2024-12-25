export const sessionCookieName = "lucia_session"

export const getSessionCookieOptions = () => ({
  secure: process.env.NODE_ENV === "production",
})
