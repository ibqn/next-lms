"use client"

import { type ReactElement } from "react"
import { SidebarItem } from "@/components/sidebar-item"
import { PanelsTopLeft, Compass, List, BarChart } from "lucide-react"
import { usePathname } from "next/navigation"

type Props = {}

export type IconType = typeof PanelsTopLeft | typeof Compass

export type RouteItem = {
  icon: ReactElement
  label: string
  href: string
}

const guestRoutes: RouteItem[] = [
  {
    icon: <PanelsTopLeft />,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <Compass />,
    label: "Explore",
    href: "/explore",
  },
]

const teacherRoutes: RouteItem[] = [
  {
    icon: <List />,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: <BarChart />,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

export const SidebarRoutes = (props: Props) => {
  let routes = guestRoutes

  const pathname = usePathname()

  if (pathname.startsWith("/teacher")) {
    routes = guestRoutes.concat(teacherRoutes)
  }

  return (
    <div className="flex w-full flex-col">
      {routes.map((route, index) => (
        <SidebarItem key={index} {...route} />
      ))}
    </div>
  )
}
