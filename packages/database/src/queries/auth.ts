import argon2 from "argon2"
import { db } from "../drizzle/db"
import { userTable } from "../drizzle/schema/auth"
import { createSession, generateSessionToken } from "../lucia"
import postgres from "postgres"

export const signUp = async (username: string, password: string) => {
  const passwordHash = await argon2.hash(password)

  try {
    const [user] = await db.insert(userTable).values({ username, passwordHash }).returning({ id: userTable.id })

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

export const signIn = async (username: string, password: string) => {
  const user = await db.query.user.findFirst({
    where: ({ username: u }, { eq }) => eq(u, username),
  })

  if (!user) {
    return { token: null }
  }

  const validPassword = await argon2.verify(user.passwordHash, password)

  if (!validPassword) {
    return { token: null }
  }

  const token = generateSessionToken()
  const session = await createSession(token, user.id)

  return { token, session }
}
