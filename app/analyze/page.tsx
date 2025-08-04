"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import DashboardLayout from "./components/dashboard-layout"
import FilterPanel from "./components/filter-panel"
import WidgetGrid from "./components/widget-grid"
import AnalysisToggle from "./components/analysis-toggle"
import { Button } from "@/components/ui/button"
import { Settings, Save, Download, RefreshCw } from "lucide-react"
import {Footer} from "@/components/layout/footer"
import {Header} from "@/components/layout/header"

export default function AdvancedTransactionDashboard() {
  const [analysisMode, setAnalysisMode] = useState<"individual" | "collective">("individual")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: { start: "2024-01-01", end: "2025-12-31" },
    categories: [],
    subcategories: [],
    transactionType: "all",
    spendingType: "all",
    ageGroup: "all",
    occupation: "all",
    incomeDecile: "all",
    amountRange: { min: 0, max: 10000000 },
  })

  const handleRefreshData = async () => {
    setIsLoading(true)
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleSaveDashboard = () => {
    console.log("Dashboard configuration saved")
  }

  const handleExportData = () => {
    console.log("Data exported")
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <DashboardLayout>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h1 className="text-3xl font-bold">트랜잭션 분석 대시보드</h1>
              <p className="text-muted-foreground mt-1">
                {analysisMode === "individual" ? "개인 소비 패턴 분석" : "집단 데이터 분석 (최대 10,000명)"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                새로고침
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
              <Button variant="outline" onClick={handleSaveDashboard}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
              <Button variant={isEditMode ? "default" : "outline"} onClick={() => setIsEditMode(!isEditMode)}>
                <Settings className="h-4 w-4 mr-2" />
                {isEditMode ? "편집 완료" : "편집 모드"}
              </Button>
            </div>
          </div>

          {/* Analysis Mode Toggle */}
          <AnalysisToggle mode={analysisMode} onModeChange={setAnalysisMode} />

          {/* Filter Panel */}
          <FilterPanel filters={filters} onFiltersChange={setFilters} analysisMode={analysisMode} />

          {/* Main Content */}
          <div className="flex-1 p-6 bg-gray-50">
            <WidgetGrid isEditMode={isEditMode} filters={filters} analysisMode={analysisMode} isLoading={isLoading} />
          </div>
        </div>
      </DashboardLayout>
      <Footer />
    </DndProvider>
  )
}
