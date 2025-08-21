"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveChartContainer } from "@/components/responsive-chart-container"

const data = [
  { date: "7/1", balance: 5000000 },
  { date: "7/5", balance: 5200000 },
  { date: "7/10", balance: 4800000 },
  { date: "7/15", balance: 5100000 },
  { date: "7/20", balance: 5350000 },
  { date: "7/25", balance: 5150000 },
  { date: "7/30", balance: 5560000 },
]

export function BalanceOverTimeChart() {
  return (
    <ResponsiveChartContainer>
      <ChartContainer
        config={{
          balance: {
            label: "잔액",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`₩${value.toLocaleString()}`, "잔액"]}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-balance)"
              strokeWidth={3}
              dot={{ fill: "var(--color-balance)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
