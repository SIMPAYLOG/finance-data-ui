"use client"

import { useState } from "react"
import { ChartCard } from "@/components/chart-card"
import { DynamicChart } from "@/components/dynamic-chart"

interface CustomizableChartCardProps {
  title: string
  description?: string
  initialConfig?: any
  data?: any[]
}

export function CustomizableChartCard({
  title,
  description,
  initialConfig = {
    type: "bar",
    xAxis: "month",
    yAxis: "amount",
    aggregation: "sum",
    groupBy: "",
    colors: ["hsl(var(--chart-1))"],
  },
  data = [],
}: CustomizableChartCardProps) {
  const [chartConfig, setChartConfig] = useState(initialConfig)

  return (
    <ChartCard title={title} description={description} chartType={chartConfig.type}>
      <DynamicChart config={chartConfig} data={data} />
    </ChartCard>
  )
}
