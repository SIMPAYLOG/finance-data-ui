"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSessionStore } from "@/store/useSessionStore"
import { useChartData } from "@/app/analyze/hooks/useChartData" // useChartData 훅 import
import { ChartCard } from "@/components/chart-card"
import { DynamicChart } from "@/components/dynamic-chart"

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
  mappingUrl: string
}

export function CustomChart({
  title,
  description,
  initialConfig = {
    type: "pie",
    xAxis: "category",
    yAxis: "income",
    aggregation: "sum",
    colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
  },
  filters,
  mappingUrl,
}: CustomizableChartCardProps) {
  const [chartConfig, setChartConfig] = useState(initialConfig)

  const sessionId = useSessionStore((state) => state.sessionId)
  
  // 2. API 요청 정보 설정
  const endpoint = mappingUrl
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

  const { data, isLoading, error } = useChartData<CategoryData>({
    endpoint: params ? endpoint : null,
    params,
    transformData: useCallback((result: any) => {
      return result || []
    }, []),
     refreshKey: 0,
  })


  return (
    <ChartCard title={title} description={description} chartType={chartConfig.type}>
      <DynamicChart config={chartConfig} data={data} />
    </ChartCard>
  )
}
