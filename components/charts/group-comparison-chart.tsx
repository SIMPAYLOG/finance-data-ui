"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { category: "식비", myAmount: 450000, groupAvg: 380000 },
  { category: "교통비", myAmount: 280000, groupAvg: 320000 },
  { category: "쇼핑", myAmount: 520000, groupAvg: 250000 },
  { category: "문화생활", myAmount: 280000, groupAvg: 200000 },
  { category: "의료비", myAmount: 180000, groupAvg: 150000 },
]

export function GroupComparisonChart() {
  return (
    <ChartContainer
      config={{
        myAmount: {
          label: "내 지출",
          color: "hsl(var(--chart-1))",
        },
        groupAvg: {
          label: "그룹 평균",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => [`₩${value.toLocaleString()}`, ""]}
          />
          <Bar dataKey="myAmount" fill="var(--color-myAmount)" radius={4} />
          <Bar dataKey="groupAvg" fill="var(--color-groupAvg)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
