import { Hono } from "hono"
import type { Context } from "../utils/context"
import { signedIn } from "../middleware/signed-in"
import { getCategories } from "database/src/queries/category"
import type { Category } from "database/src/drizzle/schema/category"
import type { SuccessResponse } from "../types"

export const categoryRoutes = new Hono<Context>().get(
  "/",
  signedIn,
  async (c) => {
    const categories = await getCategories()

    return c.json<SuccessResponse<Category[]>>({
      message: "Categories received",
      data: categories,
      success: true,
    })
  }
)
