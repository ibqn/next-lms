"use client"

import { UserButton } from "@/components/user-button"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

type Props = {}

export const NavbarRoutes = (props: Props) => {
  const pathname = usePathname()

  const isTeacherPage = pathname.startsWith("/teacher")
  const isStudentPage = pathname.startsWith("/chapter")

  return (
    <div className="ml-auto flex items-center gap-x-2">
      {isTeacherPage || isStudentPage ? (
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <LogOut className="mr-2 size-4" /> Exit
        </Link>
      ) : (
        <Link
          href="/teacher/courses"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          Teacher mode
        </Link>
      )}
      <UserButton />
    </div>
  )
}
