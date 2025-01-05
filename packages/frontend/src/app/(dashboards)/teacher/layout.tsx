import { validateRequest } from "@/auth"
import { redirect } from "next/navigation"

type Props = Readonly<{
  children: React.ReactNode
}>

export default async function TeacherLayout({ children }: Props) {
  const { user } = await validateRequest()
  if (!user) {
    return redirect("/sign-in")
  }
  return children
}
