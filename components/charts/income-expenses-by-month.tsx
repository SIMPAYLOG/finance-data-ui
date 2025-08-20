"use client"

import { useSessionStore } from "@/store/useSessionStore"
import { useMemo, useCallback } from "react"
import { AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useChartData } from "@/app/analyze/hooks/useChartData"

interface AgeGroupComparisonChartProps {
  filters: any
  isLoading: boolean
  refreshKey: number
  userId?: string
}

interface AgeGroupData {
  month: string;
  income: number;
  expense: number;
}

export default function AgeGroupComparisonChart({
  filters,
  isLoading,
  refreshKey,
  userId 
}: AgeGroupComparisonChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)

    const endpoint = "/api/analysis/transactions/info";

    const params = useMemo(() => {
        if (!sessionId) {
            return undefined;
        }
        const paramsObject: Record<string, string> = {
      sessionId,
      durationStart: filters.dateRange.start,
      durationEnd: filters.dateRange.end,
      intervalType: "monthly"
    };

    if (userId) {
      paramsObject.userId = userId;
    }

    return paramsObject;
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange.end, userId]);

    const transformData = useCallback((result: any) => {
        if (!result) return [];
        return result.map((item: any) => ({
        month: item.name,
        income: item.income,
        expense: item.expense,
      }));
    }, []);

    const { 
        data, 
        isLoading: isFetching,
        error 
    } = useChartData<AgeGroupData>({
        endpoint: params ? endpoint : null,
        params,
        transformData,
        refreshKey: refreshKey,
    });

  const renderContent = () => {
    // 부모의 로딩 상태 또는 자체 로딩 상태일 때 스피너 표시
    if (isLoading || isFetching) {
      return (
        <div className="flex items-center justify-center h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    // 에러 상태일 때 에러 메시지 표시
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[350px] text-center">
          <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
          <p className="font-semibold">오류가 발생했습니다</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )
    }
    
    // 데이터가 없는 상태일 때 메시지 표시
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[350px]">
                <p className="text-center text-muted-foreground">표시할 데이터가 없습니다.</p>
            </div>
        )
    }

    // 성공적으로 데이터를 가져왔을 때 차트 표시
    return (
      <ChartContainer
        config={{
          income: { label: "평균 수입", color: "hsl(var(--chart-1))" },
          expense: { label: "평균 지출", color: "hsl(var(--chart-2))" },
        }}
        className="h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) return `₩${(value / 1000000).toFixed(0)}M`
                if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`
                return `₩${value}`
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                   formatter={(value, name) => {

                    const label = String(name);
                    const numericValue = parseFloat(String(value));

                    if (isNaN(numericValue)) {
                      return value;
                    }

                    // const valueInManWon = Math.round(numericValue / 10000);
                    return `${label}: ${numericValue.toLocaleString()}원`;
                  }}
                />
              }
            />
            <Legend />
            <Bar dataKey="income" name="평균 수입" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="평균 지출" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
        {renderContent()}
    </ResponsiveContainer>          
  )
}