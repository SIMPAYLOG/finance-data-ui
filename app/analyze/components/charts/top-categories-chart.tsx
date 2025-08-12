"use client"

import { useSessionStore } from "@/store/useSessionStore"
import { useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, List, AlertTriangle } from "lucide-react"
import { useChartData } from "@/app/analyze/hooks/useChartData"

interface TopCategoriesChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

interface ApiChartData {
  name: string
  totalAmount: number
  transactionCount: number
}

interface ChartData {
  category: string
  amount: number
  rank: number
}

export default function TopCategoriesChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: TopCategoriesChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const fetchUrl = useMemo(() => {
    if (!sessionId || !filters.dateRange.start) {
      return null
    }
    return `http://localhost:8080/api/charts/top-volume-category-counts?sessionId=${sessionId}&durationStart=${filters.dateRange.start}&durationEnd=${filters.dateRange.end}`
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange?.end])

  const transformData = useCallback((result: any): ChartData[] => {
    if (!result || !result.data) {
      return []
    }
    return result.data
      .sort((a: ApiChartData, b: ApiChartData) => b.totalAmount - a.totalAmount)
      .slice(0, 5)
      .map((item: ApiChartData, index: number) => ({
        category: item.name,
        amount: item.totalAmount,
        rank: index + 1, // 순위 부여
      }))
  }, [])

  const { 
    data: chartData,
    isLoading: isFetching, 
    error 
  } = useChartData<ChartData>({
    fetchUrl,
    transformData,
  })

  const renderContent = () => {
    // 부모의 로딩 상태 또는 자체 로딩 상태
    if (isLoading || isFetching) {
      return (
        <div className="flex items-center justify-center h-[250px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    // 에러 상태
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[250px] text-center">
          <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
          <p className="font-semibold">오류가 발생했습니다</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )
    }

    // 데이터가 없는 상태
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[250px]">
          <p className="text-center text-muted-foreground">표시할 데이터가 없습니다.</p>
        </div>
      )
    }

    // 데이터가 성공적으로 로드된 상태
    return (
      <div className="space-y-2">
        {chartData.map((item) => (
          <div key={item.rank} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {item.rank}
              </span>
              <span>{item.category}</span>
            </div>
            <span className="font-medium">{item.amount.toLocaleString()}원</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" /> 상위 소비 카테고리 TOP 5
          {analysisMode === "collective" && <span className="text-sm text-muted-foreground">(집단 평균)</span>}
        </CardTitle>
        {isEditMode && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  )
}