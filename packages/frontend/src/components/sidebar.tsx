import { Logo } from "@/components/logo"
import { SidebarRoutes } from "@/components/sidebar-routes"

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r bg-white shadow-xs">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex w-full flex-col">
        <SidebarRoutes />
      </div>
    </div>
  )
}
