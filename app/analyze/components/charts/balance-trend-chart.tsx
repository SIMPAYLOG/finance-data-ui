"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, TrendingUp } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BalanceTrendChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

export default function BalanceTrendChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: BalanceTrendChartProps) {
  const data = [
    { date: "1월", balance: 5000000 },
    { date: "2월", balance: 5700000 },
    { date: "3월", balance: 5000000 },
    { date: "4월", balance: 6000000 },
    { date: "5월", balance: 6600000 },
    { date: "6월", balance: 6200000 },
    { date: "7월", balance: 6800000 },
    { date: "8월", balance: 7400000 },
    { date: "9월", balance: 8300000 },
    { date: "10월", balance: 9000000 },
    { date: "11월", balance: 9700000 },
    { date: "12월", balance: 10200000 },
  ]

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
          <TrendingUp className="h-5 w-5" />📈 시간 흐름에 따른 잔액 변화
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
        <ChartContainer
          config={{
            balance: {
              label: "잔액",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${(value / 10000).toLocaleString()}만원`]}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--color-balance)"
                fillOpacity={1}
                fill="url(#balanceGradient)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
