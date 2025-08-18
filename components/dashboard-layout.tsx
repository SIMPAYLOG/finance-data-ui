"use client"

import { MainDashboard } from "@/components/main-dashboard"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { UserComparison } from "@/components/user-comparison"
import { DashboardSettings } from "@/components/dashboard-settings"
import { FilterPanel } from "@/components/filter-panel"
import type { ActiveView } from "@/app/analyze/page"

interface DashboardLayoutProps {
  activeView: ActiveView
}

export function DashboardLayout({ activeView }: DashboardLayoutProps) {
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <MainDashboard />
      case "analytics":
        return <AdvancedAnalytics />
      case "user-comparison":
        return <UserComparison />
      case "settings":
        return <DashboardSettings />
      default:
        return <MainDashboard />
    }
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  )
}
