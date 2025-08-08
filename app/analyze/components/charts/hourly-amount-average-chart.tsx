"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, BarChart3 } from "lucide-react"
import { useSessionStore } from "@/store/useSessionStore"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface HourlyAmountAverageChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

interface ApiDataItem {
  hour: number
  avgSpentAmount: number
  avgIncomeAmount: number
}

export default function HourlyAmountAverageChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: HourlyAmountAverageChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const [data, setData] = useState<ApiDataItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId || !filters?.dateRange?.start || !filters?.dateRange?.end) return
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:8080/api/analysis/hour-amount-average?sessionId=${sessionId}&durationStart=${filters.dateRange.start}&durationEnd=${filters.dateRange.end}`
        )
        const json = await res.json()
        setData(Array.isArray(json?.result?.data) ? json.result.data : [])
      } catch (err) {
        console.error("시간별 평균 거래금액 데이터 로드 실패", err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange?.end])

  const chartData: ApiDataItem[] = Array(24)
    .fill(null)
    .map((_, hour) => {
      const found = data.find((d) => d.hour === hour)
      return {
        hour,
        avgSpentAmount: found?.avgSpentAmount ?? 0,
        avgIncomeAmount: found?.avgIncomeAmount ?? 0,
      }
    })

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />📊 시간대별 평균 거래금액
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
        <ChartContainer
          config={{
            avgSpentAmount: {
              label: "평균 지출",
              color: "hsl(var(--chart-1))",
            },
            avgIncomeAmount: {
              label: "평균 수입",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={(hour) => `${hour}시`}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 10000
                    ? `${(value / 10000).toFixed(0)}만`
                    : value.toString()
                }
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === "avgSpentAmount" ? "평균 지출" : "평균 수입",
                ]}
              />
              <Legend />
              <Bar
                dataKey="avgSpentAmount"
                fill="var(--color-chart-1)"
                name="평균 지출"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="avgIncomeAmount"
                fill="var(--color-chart-2)"
                name="평균 수입"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
