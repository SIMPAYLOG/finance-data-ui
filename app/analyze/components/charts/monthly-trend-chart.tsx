"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MonthlyTrendChartProps {
  filters: any
  isEditMode: boolean
  onRemove: () => void
}

export default function MonthlyTrendChart({ filters, isEditMode, onRemove }: MonthlyTrendChartProps) {
  const data = [
    { month: "1월", income: 3500000, expense: 2800000 },
    { month: "2월", income: 3600000, expense: 2900000 },
    { month: "3월", income: 3400000, expense: 3100000 },
    { month: "4월", income: 3700000, expense: 2700000 },
    { month: "5월", income: 3800000, expense: 3200000 },
    { month: "6월", income: 3500000, expense: 2900000 },
    { month: "7월", income: 3600000, expense: 3000000 },
    { month: "8월", income: 3900000, expense: 3300000 },
    { month: "9월", income: 3700000, expense: 2800000 },
    { month: "10월", income: 3800000, expense: 3100000 },
    { month: "11월", income: 3600000, expense: 2900000 },
    { month: "12월", income: 4000000, expense: 3500000 },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          월별 수입/지출 추이
        </CardTitle>
        {isEditMode && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: "수입",
              color: "hsl(var(--chart-1))",
            },
            expense: {
              label: "지출",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${(value / 10000).toLocaleString()}만원`]}
              />
              <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expense" stroke="var(--color-expense)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
