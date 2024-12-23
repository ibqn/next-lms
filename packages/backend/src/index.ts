import { serve } from "@hono/node-server"
import { Hono } from "hono"
import type { Context } from "./utils/context"
import { prettyJSON } from "hono/pretty-json"
import type { ErrorResponse, SuccessResponse } from "./types"
import { HTTPException } from "hono/http-exception"
import { getErrorMessage } from "./utils/error"
import { cors } from "hono/cors"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import {
  getSessionCookieOptions,
  sessionCookieName,
  validateSessionToken,
} from "database/src/lucia"
import { authRoute } from "./routes/auth"
import { courseRoute } from "./routes/courses"
import { uploadRoute, fileRoute } from "./routes/uploads"

const app = new Hono<Context>()

app.use(prettyJSON())

app.notFound((c) =>
  c.json<ErrorResponse>({ error: "Not Found", success: false }, 404)
)

app.get("/", (c) =>
  c.json<SuccessResponse>({ success: true, message: "Hello Hono!" }, 201)
)

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    const errorResponse =
      error.res ??
      c.json<ErrorResponse>(
        { success: false, error: error.message },
        error.status
      )
    return errorResponse
  }

  return c.json<ErrorResponse>(
    { success: false, error: getErrorMessage(error) },
    500
  )
})

app.use("*", cors(), async (c, next) => {
  const token = getCookie(c, sessionCookieName)
  // console.log("token", token)
  if (!token) {
    c.set("user", null)
    c.set("session", null)
    return await next()
  }

  const { session, user } = await validateSessionToken(token)
  if (session) {
    setCookie(c, sessionCookieName, token, getSessionCookieOptions())
  }
  // else {
  //   deleteCookie(c, "session_token")
  // }
  c.set("session", session)
  c.set("user", user)

  await next()
})

export const routes = app
  .route("/uploads", fileRoute)
  .basePath("/api")
  .route("/auth", authRoute)
  .route("/courses", courseRoute)
  .route("/uploads", uploadRoute)

const port = 3333
console.log(`Server is running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
