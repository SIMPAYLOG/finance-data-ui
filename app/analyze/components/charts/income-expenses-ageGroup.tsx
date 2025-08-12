"use client"

import { useSessionStore } from "@/store/useSessionStore"
import { useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, BarChart3, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useChartData } from "@/app/analyze/hooks/useChartData"

interface AgeGroupComparisonChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

interface AgeGroupData {
  ageGroup: string;
  income: number;
  expense: number;
}

export default function AgeGroupComparisonChart({
  filters,
  isEditMode,
  isLoading,
  onRemove,
  onEdit,
}: AgeGroupComparisonChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)

  // 1. API URL을 useMemo로 안전하게 생성
  const fetchUrl = useMemo(() => {
    if (!sessionId || !filters.dateRange.start) {
      return null;
    }
    return `http://localhost:8080/api/charts/income-expense/by-age-group?sessionId=${sessionId}&durationStart=${filters.dateRange.start}&durationEnd=${filters.dateRange.end}`;
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange?.end]);

  const transformData = useCallback((result: any) => {
    return Object.entries(result).map(([key, value]: [string, any]) => ({
      ageGroup: key,
      income: value.averageIncome,
      expense: value.averageExpense,
    }));
  }, []);

  // 2. 커스텀 훅을 호출하여 데이터, 로딩, 에러 상태를 한번에 받아옴
  const { 
    data, 
    isLoading: isFetching,
    error 
  } = useChartData<AgeGroupData>({
    fetchUrl,
    transformData,
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
            <XAxis dataKey="ageGroup" />
            <YAxis
              tickFormatter={(value: any) => {
                const numericValue = parseFloat(value);
                if (isNaN(numericValue)) return value;
                return `${(numericValue / 10000)}만원`;
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

                    const valueInManWon = Math.round(numericValue / 10000);
                    return `${label}: ${valueInManWon.toLocaleString()}만원`;
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
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />📊 연령대별 평균 수입/지출
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