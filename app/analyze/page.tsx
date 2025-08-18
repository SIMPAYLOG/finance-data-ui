"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FilterProvider } from "@/components/filter-provider"
import { Header } from "@/components/layout/header"

export type ActiveView = "dashboard" | "analytics" | "user-comparison" | "settings"

export default function Page() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
          <SidebarProvider>
            <AppSidebar activeView={activeView} setActiveView={setActiveView} />
              <div className="flex-1 overflow-auto">
                <DashboardLayout activeView={activeView} />
              </div>
          </SidebarProvider>
      </div>
    </div>
  )
}
