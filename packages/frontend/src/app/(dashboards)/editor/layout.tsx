import { validateRequest } from "@/auth"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export default async function TeacherLayout({ children }: Props) {
  const { user } = await validateRequest()
  if (!user) {
    return redirect("/sign-in")
  }
  return children
}
