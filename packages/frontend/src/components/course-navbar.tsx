import { NavbarRoutes } from "@/components/navbar-routes"
import { CourseMobileSidebar } from "@/components/course-mobile-sidebar"

export const CourseNavbar = () => {
  return (
    <nav className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar />
      <NavbarRoutes />
    </nav>
  )
}
