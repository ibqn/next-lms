export const Permission = {
  userCreate: "user:create",
  userView: "user:view",
  userUpdate: "user:update",
  userDelete: "user:delete",

  roleCreate: "role:create",
  roleView: "role:view",
  roleUpdate: "role:update",
  roleDelete: "role:delete",
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]
