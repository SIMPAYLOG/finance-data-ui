"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveChartContainer } from "@/components/responsive-chart-container"

const data = [
  { month: "1월", income: 2400000, expense: 1800000 },
  { month: "2월", income: 2200000, expense: 1900000 },
  { month: "3월", income: 2500000, expense: 2100000 },
  { month: "4월", income: 2300000, expense: 1700000 },
  { month: "5월", income: 2600000, expense: 1950000 },
  { month: "6월", income: 2450000, expense: 1890000 },
]

export function MonthlyIncomeExpenseChart() {
  return (
    <ResponsiveChartContainer>
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
        className="w-full h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} interval={0} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`₩${value.toLocaleString()}`, ""]}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveChartContainer>
  )
}
