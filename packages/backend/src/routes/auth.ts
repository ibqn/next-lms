import type { Context } from "../utils/context"
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { signinSchema } from "database/src/validators/signin"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import type { SuccessResponse } from "../types"
import { HTTPException } from "hono/http-exception"
import { signedIn } from "../middleware/signed-in"
import { signIn, signUp } from "database/src/queries/auth"
import type { User } from "database/src/drizzle/schema/auth"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import { invalidateSessionToken } from "database/src/lucia"

const authRoute = new Hono<Context>()
  .post("/signup", zValidator("form", signinSchema), async (c) => {
    const { username, password } = c.req.valid("form")

    const { token } = await signUp(username, password)

    if (!token) {
      throw new HTTPException(409, { message: "Username already exists" })
    }

    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    return c.json<SuccessResponse>(
      { success: true, message: "User created" },
      201
    )
  })
  .post("/signin", zValidator("form", signinSchema), async (c) => {
    const { username, password } = c.req.valid("form")

    const { token } = await signIn(username, password)

    if (!token) {
      throw new HTTPException(401, { message: "Invalid username or password" })
    }

    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    return c.json<SuccessResponse>({ success: true, message: "Signed in" }, 201)
  })
  .get("/signout", signedIn, async (c) => {
    const token = getCookie(c, sessionCookieName)
    if (token) {
      await invalidateSessionToken(token)
      deleteCookie(c, sessionCookieName)
      return c.json<SuccessResponse>({ success: true, message: "Signed out" })
    }
    throw new HTTPException(401, {
      message: "You must be signed in to sign out",
    })
  })
  .get("/user", signedIn, async (c) => {
    const user = c.get("user") as User
    return c.json<SuccessResponse<User>>({
      success: true,
      data: user,
      message: "User data",
    })
  })

export { authRoute }
