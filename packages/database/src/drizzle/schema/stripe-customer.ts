import { index, primaryKey, text, uuid } from "drizzle-orm/pg-core"
import { schema } from "./schema"
import { lifecycleDates } from "./utils"
import { userTable, type User } from "./auth"
import { relations, type InferSelectModel } from "drizzle-orm"

export const stripeCustomerTable = schema.table(
  "stripe_customer",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
      }),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),

    ...lifecycleDates,
  },

  (table) => [primaryKey({ columns: [table.userId, table.stripeCustomerId] }), index().on(table.stripeCustomerId)]
)

export const stripeCustomerRelations = relations(stripeCustomerTable, ({ one }) => ({
  user: one(userTable, { fields: [stripeCustomerTable.userId], references: [userTable.id] }),
}))

export type StripeCustomer = InferSelectModel<typeof stripeCustomerTable> & {
  user?: User | null
}
