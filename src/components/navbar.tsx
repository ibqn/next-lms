import { MobileSidebar } from "@/components/mobile-sidebar"
import { NavbarRoutes } from "@/components/navbar-routes"

type Props = {}

export const Navbar = (props: Props) => {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}
