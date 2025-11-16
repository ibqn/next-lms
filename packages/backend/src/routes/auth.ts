import type { ExtEnv } from "../utils/extended-env"
import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { signinSchema } from "database/src/validators/signin"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { response, type SuccessResponse } from "database/src/types"
import { HTTPException } from "hono/http-exception"
import { signedIn } from "../middleware/signed-in"
import { signIn, signUp } from "database/src/queries/auth"
import type { User } from "database/src/drizzle/schema/auth"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"
import { invalidateSessionToken } from "database/src/lucia"

const authRoute = new Hono<ExtEnv>()
  .post("/signup", zValidator("json", signinSchema), async (c) => {
    const { username, password } = c.req.valid("json")

    const { token } = await signUp(username, password)

    if (!token) {
      throw new HTTPException(409, { message: "Username already exists" })
    }

    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    return c.json<SuccessResponse>(response("User created"), 201)
  })
  .post("/signin", zValidator("json", signinSchema), async (c) => {
    const { username, password } = c.req.valid("json")

    const { token } = await signIn(username, password)

    if (!token) {
      throw new HTTPException(401, { message: "Invalid username or password" })
    }

    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
    return c.json<SuccessResponse>(response("Signed in"), 201)
  })
  .get("/signout", signedIn, async (c) => {
    const token = getCookie(c, sessionCookieName)
    if (token) {
      await invalidateSessionToken(token)
      deleteCookie(c, sessionCookieName)
      return c.json<SuccessResponse>(response("Signed out"), 200)
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
  .get("/validate", async (c) => {
    const user = c.get("user")
    const session = c.get("session")

    const data = { user, session }

    return c.json<SuccessResponse<typeof data>>({
      success: true,
      message: "Session validation result",
      data,
    })
  })

export { authRoute }
