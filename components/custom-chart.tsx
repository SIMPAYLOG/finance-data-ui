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
  userId?: string
  refreshKey: number
}

export function CustomChart({
  title,
  description,
  initialConfig,
  filters,
  mappingUrl,
  userId,
  refreshKey,
}: CustomizableChartCardProps) {
  const [chartConfig, setChartConfig] = useState(initialConfig)
  const sessionId = useSessionStore((state) => state.sessionId)
  
  const endpoint = mappingUrl
  const params = useMemo(() => {
    if (!sessionId || !filters.dateRange.start) {
      return undefined
    }
    const paramsObject: Record<string, string> = {
      sessionId,
      durationStart: filters.dateRange.start,
      durationEnd: filters.dateRange.end,
    };

    if (userId) {
      paramsObject.userId = userId;
    }

    return paramsObject;
  }, [sessionId, filters.dateRange.start, filters.dateRange.end, userId, mappingUrl])

  const { data, isLoading, error } = useChartData<CategoryData>({
    endpoint: params ? endpoint : null,
    params,
    transformData: useCallback((result: any) => {
      return result || []
    }, []),
     refreshKey: refreshKey,
  })

  console.log(data)
  
  return (
    <ChartCard title={title} description={description} chartType={chartConfig.type}>
      <DynamicChart config={chartConfig} data={Array.isArray(data) ? data : []} />
    </ChartCard>
  )
}
