import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import { db } from "@/db"
import authConfig from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [],
})
