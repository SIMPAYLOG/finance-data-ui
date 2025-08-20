"use client"

import { useSessionStore } from "@/store/useSessionStore"
import { useMemo, useCallback } from "react"
import { AlertTriangle } from "lucide-react"
import { useChartData } from "@/app/analyze/hooks/useChartData"
import { ResponsiveContainer } from "recharts"

interface TopCategoriesChartProps {
  filters: any
  isLoading: boolean
}

interface ApiChartData {
  category: string
  income: number
  count: number
}

interface ChartData {
  category: string
  amount: number
  rank: number
}

export default function TopCategoriesChart({
  filters,
  isLoading
}: TopCategoriesChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)

  const endpoint = "/api/analysis/category/by-volume-top5";

    const params = useMemo(() => {
        // 필수 값들이 없으면 null을 반환하여 API 요청을 막습니다.
        if (!sessionId || !filters.dateRange.start) {
            return undefined;
        }
        return {
            sessionId,
            durationStart: filters.dateRange.start,
            durationEnd: filters.dateRange.end,
        };
    }, [sessionId, filters?.dateRange?.start, filters?.dateRange.end]);


  const transformData = useCallback((result: any): ChartData[] => {
    if (!result) {
      return []
    }
    return result
      .sort((a: ApiChartData, b: ApiChartData) => b.income - a.income)
      .slice(0, 5)
      .map((item: ApiChartData, index: number) => ({
        category: item.category,
        amount: item.income,
        rank: index + 1, // 순위 부여
      }))
  }, [])

  const { 
    data: chartData,
    isLoading: isFetching, 
    error 
  } = useChartData<ChartData>({
          endpoint: params ? endpoint : null,
          params,
          transformData,
          refreshKey: 0,
      });

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
            <span className="font-medium flex-shrink-0 tabular-nums">{(item.amount || 0).toLocaleString()}원</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
            {renderContent()}
    </ResponsiveContainer>  
  )
}