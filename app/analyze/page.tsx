"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Header } from "@/components/layout/header"
import { useSearchParams } from "next/navigation";
import FilterPanel from "@/components/filter-panel"

export type ActiveView = "dashboard" | "analytics" | "user-comparison" | "settings"

function AnalyzeContent() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")
  const searchParams = useSearchParams()

  const today = new Date()
  const oneMonthAgo = new Date(today)
  oneMonthAgo.setMonth(today.getMonth() - 1)

  const formatDate = (date: Date) => date.toISOString().split("T")[0]
  const durationStart = searchParams.get("durationStart") ?? formatDate(oneMonthAgo)
  const durationEnd = searchParams.get("durationEnd") ?? formatDate(today)

  const [filters, setFilters] = useState({
    dateRange: { start: durationStart, end: durationEnd },
    categories: [],
    subcategories: [],
    transactionType: "DEPOSIT",
    spendingType: "all",
    ageGroup: "all",
    occupation: "all",
    incomeDecile: "all",
    amountRange: { min: 0, max: 10000000 },
  })
  
  useEffect(() => {
    if (activeView === 'user-comparison') {
      setFilters(currentFilters => ({
        ...currentFilters,
        transactionType: 'DEPOSIT',
      }));
    }
  }, [activeView]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
          <SidebarProvider>
            <AppSidebar activeView={activeView} setActiveView={setActiveView} />
              <div className="flex-1 overflow-auto">
                <FilterPanel filters={filters} onFiltersChange={setFilters} hideTransactionFilter={activeView != 'user-comparison'}/>
                <DashboardLayout activeView={activeView} filters={filters}/>
              </div>
          </SidebarProvider>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <AnalyzeContent />
    </Suspense>
  )
}
