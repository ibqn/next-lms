import { useMemo } from "react"
import { Layout, Compass } from "lucide-react"
import { SidebarItem } from "./sidebar-item"

type Props = {}

type IconType = typeof Layout

export type RouteItem = {
  icon: IconType
  label: string
  href: string
}

export const SidebarRoutes = (props: Props) => {
  const questRoutes = useMemo(
    () => [
      {
        icon: Layout,
        label: "Dashboard",
        href: "/",
      },
      {
        icon: Compass,
        label: "Explore",
        href: "/explore",
      },
    ],
    []
  )

  return (
    <div className="flex w-full flex-col">
      {questRoutes.map((route, index) => (
        <SidebarItem key={index} {...route} />
      ))}
    </div>
  )
}
