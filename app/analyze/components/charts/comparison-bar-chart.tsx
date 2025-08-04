"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ComparisonBarChartProps {
  filters: any
  isEditMode: boolean
  onRemove: () => void
}

export default function ComparisonBarChart({ filters, isEditMode, onRemove }: ComparisonBarChartProps) {
  const data = [
    { category: "20대", mySpending: 2800000, avgSpending: 2500000 },
    { category: "30대", mySpending: 3200000, avgSpending: 3100000 },
    { category: "40대", mySpending: 2900000, avgSpending: 3500000 },
    { category: "50대", mySpending: 2600000, avgSpending: 3200000 },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          연령대별 지출 비교
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
            mySpending: {
              label: "내 지출",
              color: "hsl(var(--chart-1))",
            },
            avgSpending: {
              label: "평균 지출",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${(value / 10000).toLocaleString()}만원`]}
              />
              <Bar dataKey="mySpending" fill="var(--color-mySpending)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgSpending" fill="var(--color-avgSpending)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
