"use client"

import { UserButton } from "@/components/user-button"
import { usePathname } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { SearchInput } from "@/components/search-input"
import Link from "next/link"

export const NavbarRoutes = () => {
  const pathname = usePathname()

  const isTeacherPage = pathname.startsWith("/teacher")
  const isCoursePage = pathname.startsWith("/course")
  const isExplorePage = pathname.startsWith("/explore")

  return (
    <>
      {isExplorePage && <SearchInput className="hidden md:flex" />}

      <div className="ml-auto flex items-center gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <LogOut className="mr-2 size-4" /> Exit
          </Link>
        ) : (
          <Link href="/teacher/courses" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Teacher mode
          </Link>
        )}
        <UserButton />
      </div>
    </>
  )
}
