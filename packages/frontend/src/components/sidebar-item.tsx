"use client"

import Link from "next/link"
import { useMemo, type ComponentProps } from "react"
import type { RouteItem } from "@/components/sidebar-routes"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type Props = RouteItem & ComponentProps<typeof Link>

export const SidebarItem = ({ icon, label, href, className, ...props }: Props) => {
  const pathname = usePathname()

  const isActive = useMemo(() => pathname === href, [pathname, href])

  return (
    <Link
      {...props}
      href={href}
      className={cn(
        "relative flex items-center gap-x-2 pl-6 text-sm font-medium transition-all",
        isActive ? "bg-sky-200/20 text-sky-700" : "text-slate-500 hover:bg-slate-300/20 hover:text-slate-600",
        className
      )}
    >
      <div className="flex items-center gap-x-2 p-4">
        <icon.type
          {...(typeof icon.props === "object" ? icon.props : {})}
          className={cn(isActive ? "text-sky-700" : "text-slate-500")}
          size={22}
        />
        <span>{label}</span>
      </div>

      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 border-2 border-sky-700 transition-all",
          isActive ? "opacity-100" : "opacity-0"
        )}
      ></div>
    </Link>
  )
}
