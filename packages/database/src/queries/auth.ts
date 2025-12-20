import argon2 from "argon2"
import { db } from "../drizzle/db"
import { userTable } from "../drizzle/schema/auth"
import { createSession, generateSessionToken } from "../lucia"
import postgres from "postgres"
import type { SigninSchema } from "../validators/signin"
import type { SignupSchema } from "../validators/signup"

export const signUp = async (inputData: SignupSchema) => {
  const passwordHash = await argon2.hash(inputData.password)

  try {
    const [user] = await db
      .insert(userTable)
      .values({ ...inputData, passwordHash })
      .returning({ id: userTable.id })

    const token = generateSessionToken()
    await createSession(token, user.id)

    return { token }
  } catch (error) {
    if (error instanceof postgres.PostgresError && error.code === "23505") {
      return { token: null }
    }
    throw error
  }
}

export const signIn = async (inputData: SigninSchema) => {
  const user = await db.query.user.findFirst({
    where: ({ email }, { eq }) => eq(email, inputData.email),
  })

  if (!user) {
    return { token: null }
  }

  const validPassword = await argon2.verify(user.passwordHash, inputData.password)

  if (!validPassword) {
    return { token: null }
  }

  const token = generateSessionToken()
  const session = await createSession(token, user.id)

  return { token, session }
}
