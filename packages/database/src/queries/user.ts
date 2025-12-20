import type { ParamIdSchema } from "../validators/param"
import { db } from "../drizzle/db"
import type { User } from "../drizzle/schema/auth"

export const getUser = async ({ id: userId }: ParamIdSchema): Promise<User | null> => {
  const user = await db.query.user.findFirst({
    where: ({ id }, { eq }) => eq(id, userId),
    columns: { passwordHash: false },
  })

  if (!user) {
    return null
  }

  return user satisfies User
}
