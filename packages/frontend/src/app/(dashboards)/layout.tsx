import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import type { ReactNode } from "react"

type Props = Readonly<{
  children: ReactNode
}>

export default async function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-svh max-w-full flex-1">
      <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-56">
        <Navbar />
      </div>

      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      <main className="flex w-full flex-col pt-20 md:pl-56">{children}</main>
    </div>
  )
}
