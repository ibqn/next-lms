import { Logo } from "@/components/logo"
import { SidebarRoutes } from "@/components/sidebar-routes"

type Props = {}

export const Sidebar = (props: Props) => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex w-full flex-col">
        <SidebarRoutes />
      </div>
    </div>
  )
}
