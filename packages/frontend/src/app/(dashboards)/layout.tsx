import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

type Props = Readonly<{
  children: React.ReactNode
}>

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-56">
        <Navbar />
      </div>

      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="h-full pt-[80px] md:pl-56">{children}</main>
    </div>
  )
}
