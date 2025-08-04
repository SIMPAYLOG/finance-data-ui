"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit, Users } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CollectiveComparisonChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

export default function CollectiveComparisonChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: CollectiveComparisonChartProps) {
  const data = [
    { group: "20대", mySpending: 2800000, avgSpending: 2500000, userCount: 2341 },
    { group: "30대", mySpending: 3200000, avgSpending: 3100000, userCount: 3892 },
    { group: "40대", mySpending: 2900000, avgSpending: 3500000, userCount: 2156 },
    { group: "50대", mySpending: 2600000, avgSpending: 3200000, userCount: 1611 },
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
          <Users className="h-5 w-5" />👥 집단 유저의 평균 소비/수입 비교
          <span className="text-sm text-muted-foreground">
            (총 {data.reduce((sum, item) => sum + item.userCount, 0).toLocaleString()}명)
          </span>
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
            mySpending: {
              label: analysisMode === "individual" ? "내 지출" : "선택 그룹 평균",
              color: "hsl(var(--chart-1))",
            },
            avgSpending: {
              label: "전체 평균",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string, props: any) => [
                  `${(value / 10000).toLocaleString()}만원`,
                  name,
                  `(${props.payload.userCount.toLocaleString()}명)`,
                ]}
              />
              <Legend />
              <Bar dataKey="mySpending" fill="var(--color-mySpending)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgSpending" fill="var(--color-avgSpending)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
