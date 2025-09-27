"use client"

import { MainDashboard } from "@/components/main-dashboard"
import { UserComparison } from "@/components/user-comparison"
import { UserAnalysis } from "@/components/user-analysis"
import { DatasetDownload } from "@/components/dataset-download"
import type { ActiveView } from "@/app/analyze/page"
// import { AdvancedAnalytics } from "@/components/advanced-analytics"
// import { DashboardSettings } from "@/components/dashboard-settings"

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
        return <UserAnalysis filters={filters} />
      case "settings":
        return <DatasetDownload filters={filters} />
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
