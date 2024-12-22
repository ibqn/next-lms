import type { HTTPResponseError } from "hono/types"

export const getErrorMessage = (error: Error | HTTPResponseError) =>
  process.env.NODE_ENV === "production" ? "Internal server error" : error.stack ?? error.message
