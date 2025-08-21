"use client"

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveChartContainer } from "@/components/responsive-chart-container"

const data = [
  { name: "식비", value: 450000, color: "hsl(var(--chart-1))" },
  { name: "교통비", value: 280000, color: "hsl(var(--chart-2))" },
  { name: "쇼핑", value: 320000, color: "hsl(var(--chart-3))" },
  { name: "문화생활", value: 180000, color: "hsl(var(--chart-4))" },
  { name: "의료비", value: 120000, color: "hsl(var(--chart-5))" },
  { name: "기타", value: 540000, color: "hsl(var(--chart-6))" },
]

export function CategoryExpenseChart() {
  return (
    <ResponsiveChartContainer aspectRatio={1}>
      <ChartContainer
        config={{
          value: {
            label: "지출액",
          },
        }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="70%"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`₩${value.toLocaleString()}`, "지출액"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
