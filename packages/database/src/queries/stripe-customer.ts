import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"
import { stripeCustomerTable, type StripeCustomer } from "../drizzle/schema/stripe-customer"

type GetStripeCustomerOptions = {
  userId: User["id"]
}

export const getStripeCustomerItem = async ({ userId }: GetStripeCustomerOptions): Promise<StripeCustomer | null> => {
  const stripeCustomer = await db.query.stripeCustomer.findFirst({
    where: (stripeCustomer, { eq }) => eq(stripeCustomer.userId, userId),
  })

  if (!stripeCustomer) {
    return null
  }

  return stripeCustomer satisfies StripeCustomer
}

type CreateStripeCustomerItemOptions = {
  userId: User["id"]
  stripeCustomerId: string
}

export const createStripeCustomerItem = async ({
  userId,
  stripeCustomerId,
}: CreateStripeCustomerItemOptions): Promise<StripeCustomer> => {
  const [stripeCustomer] = await db
    .insert(stripeCustomerTable)
    .values({
      userId,
      stripeCustomerId,
    })
    .returning()

  return stripeCustomer satisfies StripeCustomer
}
