import { Sidebar } from "@/components/sidebar"

type Props = Readonly<{
  children: React.ReactNode
}>

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>
      {children}
    </div>
  )
}
