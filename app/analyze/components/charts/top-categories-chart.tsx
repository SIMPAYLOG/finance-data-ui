"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, List } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TopCategoriesChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

export default function TopCategoriesChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: TopCategoriesChartProps) {
  const data = [
    { category: "주거비", amount: 1200000, rank: 1 },
    { category: "식비", amount: 800000, rank: 2 },
    { category: "쇼핑", amount: 500000, rank: 3 },
    { category: "문화생활", amount: 400000, rank: 4 },
    { category: "교통비", amount: 300000, rank: 5 },
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
          <List className="h-5 w-5" />💡 상위 소비 카테고리 TOP 5
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
            amount: {
              label: "지출액",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
              <XAxis type="number" tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
              <YAxis type="category" dataKey="category" width={60} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${(value / 10000).toLocaleString()}만원`]}
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Ranking List */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {item.rank}
                </span>
                <span>{item.category}</span>
              </div>
              <span className="font-medium">{(item.amount / 10000).toLocaleString()}만원</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
