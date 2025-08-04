"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, PieChart } from "lucide-react"
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Pie, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CategoryPieChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

export default function CategoryPieChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: CategoryPieChartProps) {
  const data = [
    { name: "식비", value: 800000, fill: "hsl(var(--chart-1))" },
    { name: "교통비", value: 300000, fill: "hsl(var(--chart-2))" },
    { name: "쇼핑", value: 500000, fill: "hsl(var(--chart-3))" },
    { name: "문화생활", value: 400000, fill: "hsl(var(--chart-4))" },
    { name: "주거비", value: 1200000, fill: "hsl(var(--chart-5))" },
    { name: "기타", value: 300000, fill: "hsl(var(--chart-6))" },
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
          <PieChart className="h-5 w-5" />🧁 카테고리별 지출 비중
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
            value: {
              label: "지출액",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${(value / 10000).toLocaleString()}만원`]}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
