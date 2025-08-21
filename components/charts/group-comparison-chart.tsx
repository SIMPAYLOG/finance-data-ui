"use client"

import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface GroupComparisonChartItem {
  key: string        // 원본 categoryType
  category: string   // 한글 라벨
  groupAvg: number
  myAmount: number
}

interface GroupComparisonChartProps {
  data: GroupComparisonChartItem[]
  transactionType: "WITHDRAW" | "DEPOSIT" | "all"
}

export function GroupComparisonChart({ data, transactionType }: GroupComparisonChartProps) {
  // 기존 시각화 로직 유지 (API 호출만 제거)
  const myLabel = transactionType === "DEPOSIT" ? "내 수입" : "내 지출"
  const groupLabel = transactionType === "DEPOSIT" ? "그룹 수입" : "그룹 지출"

  return (
    <ChartContainer
      config={{
        myAmount: { label: myLabel, color: "hsl(var(--chart-1))" },
        groupAvg: { label: groupLabel, color: "hsl(var(--chart-2))" },
      }}
      className="h-[400px]"
    >
      <div className="flex flex-col h-full">
        {/* 범례 */}
        <div className="flex justify-start gap-4 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-[var(--color-myAmount)]"></div>
            <span className="text-sm">{myLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-[var(--color-groupAvg)]"></div>
            <span className="text-sm">{groupLabel}</span>
          </div>
        </div>

        {/* 차트 */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" interval={0} angle={-30} textAnchor="end" height={70} />
            <YAxis tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`₩${value.toLocaleString()}`, ""]}
            />
            <Bar dataKey="myAmount" fill="var(--color-myAmount)" radius={4} />
            <Bar dataKey="groupAvg" fill="var(--color-groupAvg)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
