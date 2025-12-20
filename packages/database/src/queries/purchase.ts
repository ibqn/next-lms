import unset from "lodash.unset"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import type { Course } from "../drizzle/schema/course"
import { purchaseTable, type Purchase } from "../drizzle/schema/purchase"

type GetPurchaseItemOptions = {
  courseId: Course["id"]
  userId: User["id"]
}

export const getPurchaseItem = async ({ courseId, userId }: GetPurchaseItemOptions): Promise<Purchase | null> => {
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

type CreatePurchaseItemOptions = {
  courseId: Course["id"]
  userId: User["id"]
}

export const createPurchaseItem = async ({ courseId, userId }: CreatePurchaseItemOptions): Promise<Purchase> => {
  const [purchase] = await db.insert(purchaseTable).values({ courseId, userId }).returning()
  return purchase satisfies Purchase
}
