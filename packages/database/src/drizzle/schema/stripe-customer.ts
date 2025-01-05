import { uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"

export const stripeCustomerTable = schema.table("stripe_customer", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeCustomerId: uuid("stripe_customer_id").unique(),

  userId: uuid("user_id").notNull(),

  ...lifecycleDates,
})
