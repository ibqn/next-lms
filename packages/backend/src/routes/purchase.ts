import { Hono } from "hono"
import type { ExtEnv } from "../utils/extended-env"
import { signedIn } from "../middleware/signed-in"
import { zValidator } from "@hono/zod-validator"
import type { SuccessResponse } from "database/src/types"
import type { User } from "database/src/drizzle/schema/auth"
import { paramIdSchema } from "database/src/validators/param"
import { getPurchaseItem } from "database/src/queries/purchase"
import type { Purchase } from "database/src/drizzle/schema/purchase"

export const purchaseRoute = new Hono<ExtEnv>().get("/:id", signedIn, zValidator("param", paramIdSchema), async (c) => {
  const { id: courseId } = c.req.valid("param")
  const user = c.get("user") as User

  const purchaseItem = await getPurchaseItem({ courseId, userId: user.id })

  return c.json<SuccessResponse<Purchase | null>>({
    success: true,
    data: purchaseItem,
    message: "Purchase retrieved",
  })
})
