import unset from "lodash.unset"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import type { Course } from "../drizzle/schema/course"
import type { Purchase } from "../drizzle/schema/purchase"

type GetPurchaseOptions = {
  courseId: Course["id"]
  userId: User["id"]
}

export const getPurchaseItem = async ({ courseId, userId }: GetPurchaseOptions): Promise<Purchase | null> => {
  const purchase = await db.query.purchase.findFirst({
    where: (purchase, { eq, and }) => and(eq(purchase.courseId, courseId), eq(purchase.userId, userId)),
    with: {
      user: { columns: { passwordHash: false } },
    },
  })

  if (!purchase) {
    return null
  }

  unset(purchase, "user.passwordHash")
  return purchase satisfies Purchase
}
