import { drizzle } from "drizzle-orm/postgres-js"
import { sessionRelations, sessionTable, userRelations, userTable } from "./schema/auth"
import { courseRelations, courseTable } from "./schema/course"
import { categoryRelations, categoryTable } from "./schema/category"
import { attachmentRelations, attachmentTable } from "./schema/attachment"
import { uploadRelations, uploadTable } from "./schema/upload"
import { chapterRelations, chapterTable } from "./schema/chapter"
import { env } from "../env"
import {
  permissionRelations,
  permissionTable,
  rolePermissionRelations,
  rolePermissionTable,
  roleRelations,
  roleTable,
  userRoleRelations,
  userRoleTable,
} from "./schema/role"
import { purchaseRelations, purchaseTable } from "./schema/purchase"
import { userProgressRelations, userProgressTable } from "./schema/user-progress"
import { stripeCustomerRelations, stripeCustomerTable } from "./schema/stripe-customer"

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    user: userTable,
    userRelations,
    session: sessionTable,
    sessionRelations,
    chapter: chapterTable,
    chapterRelations,
    course: courseTable,
    courseRelations,
    category: categoryTable,
    categoryRelations,
    attachment: attachmentTable,
    attachmentRelations,
    upload: uploadTable,
    uploadRelations,
    role: roleTable,
    roleRelations,
    userRole: userRoleTable,
    userRoleRelations,
    permission: permissionTable,
    permissionRelations,
    rolePermission: rolePermissionTable,
    rolePermissionRelations,
    purchase: purchaseTable,
    purchaseRelations,
    userProgress: userProgressTable,
    userProgressRelations,
    stripeCustomer: stripeCustomerTable,
    stripeCustomerRelations,
  },
})
