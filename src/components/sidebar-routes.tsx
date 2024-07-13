import { type ReactElement } from "react"
import { SidebarItem } from "@/components/sidebar-item"
import { PanelsTopLeft, Compass } from "lucide-react"

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

export const SidebarRoutes = (props: Props) => {
  return (
    <div className="flex w-full flex-col">
      {guestRoutes.map((route, index) => (
        <SidebarItem key={index} {...route} />
      ))}
    </div>
  )
}
