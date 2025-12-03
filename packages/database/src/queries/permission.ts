import { db } from "../drizzle/db"

export const havePermission = async (userId: string, permissionName: string) => {
  const user = await db.query.user.findFirst({
    where: ({ id }, { eq }) => eq(id, userId),
    with: { userRoles: { with: { role: { with: { rolePermissions: { with: { permission: true } } } } } } },
  })

  if (!user) {
    return false
  }

  for (const { role } of user.userRoles) {
    for (const { permission } of role.rolePermissions) {
      if (permission.name === permissionName) {
        return true
      }
    }
  }

  return false
}
