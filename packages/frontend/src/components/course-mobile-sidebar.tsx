import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { CourseSidebar } from "@/components/course-sidebar"
import { VisuallyHidden } from "@/components/visually-hidden"

export const CourseMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white p-0">
        <VisuallyHidden>
          <SheetTitle />
          <SheetDescription />
        </VisuallyHidden>
        <CourseSidebar />
      </SheetContent>
    </Sheet>
  )
}
