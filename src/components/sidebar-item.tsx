import Link from "next/link"
import type { ComponentProps } from "react"
import type { RouteItem } from "@/components/sidebar-routes"
import { cn } from "@/lib/utils"

type Props = RouteItem & ComponentProps<typeof Link>

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  className,
  ...props
}: Props) => {
  return (
    <Link
      {...props}
      href={href}
      className={cn("flex items-center p-4 hover:bg-gray-100", className)}
    >
      <Icon className="mr-4 h-6 w-6" />
      <span>{label}</span>
    </Link>
  )
}
