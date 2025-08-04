import type { ReactNode } from "react"
import Sidebar from "./sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
