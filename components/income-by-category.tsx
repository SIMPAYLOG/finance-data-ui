"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSessionStore } from "@/store/useSessionStore"
import { useChartData } from "@/app/analyze/hooks/useChartData" // useChartData 훅 import
import { ChartCard } from "@/components/chart-card"
import { DynamicChart } from "@/components/dynamic-chart"

// 1. Props에 filters를 추가하여 날짜 범위를 받을 수 있게 합니다.
interface CustomizableChartCardProps {
  filters: {
    dateRange: {
      start: string;
      end: string;
    }
  }
}

interface CategoryData {
  name: string;
  totalIncome: number;
  totalExpense: number;
}

interface CustomizableChartCardProps {
  title: string
  description?: string
  initialConfig?: any
  filters: {
    dateRange: {
      start: string;
      end: string;
    }
  }
}

export function IncomeByCategory({
  title,
  description,
  initialConfig = {
    type: "pie",
    xAxis: "month",
    yAxis: "amount",
    aggregation: "sum",
    colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
  },
  filters
}: CustomizableChartCardProps) {
  const [chartConfig, setChartConfig] = useState(initialConfig)

  const sessionId = useSessionStore((state) => state.sessionId)
  
  // 2. API 요청 정보 설정
  const endpoint = "/api/analysis/all-category-info"
  const params = useMemo(() => {
    if (!sessionId || !filters.dateRange.start) {
      return undefined
    }
    return {
      sessionId,
      durationStart: filters.dateRange.start,
      durationEnd: filters.dateRange.end,
    }
  }, [sessionId, filters.dateRange.start, filters.dateRange.end])

  // 3. useChartData로 데이터 가져오기
  const { data, isLoading, error } = useChartData<CategoryData>({
    endpoint: params ? endpoint : null,
    params,
    // API 응답의 result.data 배열을 그대로 반환하는 것이 핵심입니다.
    transformData: useCallback((result: any) => {
      return result?.data || []
    }, []),
     refreshKey: 0,
  })


  return (
    <ChartCard title={title} description={description} chartType={chartConfig.type}>
      <DynamicChart config={chartConfig} data={data} />
    </ChartCard>
  )
}
