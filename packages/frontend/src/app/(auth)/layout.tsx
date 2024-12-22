import { validateRequest } from "@/auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export default async function AuthLayout({ children }: Props) {
  const { user } = await validateRequest()
  if (user) {
    redirect("/")
  }

  return <div className="flex grow items-center justify-center">{children}</div>
}
