"use client"

import { MainDashboard } from "@/components/main-dashboard"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { UserComparison } from "@/components/user-comparison"
import { DashboardSettings } from "@/components/dashboard-settings"
import type { ActiveView } from "@/app/analyze/page"

interface DashboardLayoutProps {
  activeView: ActiveView
  filters: any
}

export function DashboardLayout({ activeView, filters }: DashboardLayoutProps) {
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <MainDashboard filters={filters} />
      case "user-comparison":
        return <UserComparison filters={filters} /> 
      case "analytics":
        return <AdvancedAnalytics />
      case "settings":
        return <DashboardSettings />
      default:
        return <MainDashboard filters={filters} />
    }
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  )
}
