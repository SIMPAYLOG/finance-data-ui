"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { category: "식비", amount: 750000 },
  { category: "쇼핑", amount: 520000 },
  { category: "교통비", amount: 380000 },
  { category: "문화생활", amount: 280000 },
  { category: "의료비", amount: 180000 },
]

export function TopCategoriesChart() {
  return (
    <ChartContainer
      config={{
        amount: {
          label: "지출액",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal" margin={{ left: 60, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="category" />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => [`₩${value.toLocaleString()}`, "지출액"]}
          />
          <Bar dataKey="amount" fill="var(--color-amount)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
