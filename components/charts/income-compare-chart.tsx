"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveChartContainer } from "@/components/responsive-chart-container"

interface IncomeCompareChartProps {
  overallSummary: any
  selectedSummary: any
}

export function IncomeCompareChart({ overallSummary, selectedSummary }: IncomeCompareChartProps) {
  const overallDeposit =
    overallSummary?.data?.find((item: any) => item.transactionType === "DEPOSIT")?.amount || 0
  const selectedDeposit =
    selectedSummary?.data?.find((item: any) => item.transactionType === "DEPOSIT")?.amount || 0

  const data = [
    {
      category: "총 수입",
      myAmount: selectedDeposit,
      groupAvg: overallDeposit,
    },
  ]

  const myLabel = "나의 총 수입"
  const groupLabel = "전체 총 수입 평균"

  return (
    <ResponsiveChartContainer>
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
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis
                tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`}
              />
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
    </ResponsiveChartContainer>
  )
}
