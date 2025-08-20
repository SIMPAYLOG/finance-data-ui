"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DynamicChartProps {
  config: {
    type: string
    xAxis: string
    yAxis: string
    aggregation: string
    groupBy?: string
    colors?: string[]
  }
  data: any[]
}

const formatK = (value: number) => {
    const numInK = value / 1000;

    const formatter = new Intl.NumberFormat('ko-KR', {
      maximumFractionDigits: 2, 
    });

    return `${formatter.format(numInK)}`;
  };

export function DynamicChart({ config, data }: DynamicChartProps) {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    // 데이터 집계 처리
    const grouped = data.reduce((acc, item) => {
      const key = item[config.xAxis]
      if (!acc[key]) {
        acc[key] = {
          [config.xAxis]: key,
          values: [],
        }
      }
      acc[key].values.push(item[config.yAxis])
      return acc
    }, {})
    // 집계 방식에 따른 계산
    return Object.values(grouped).map((group: any) => {
      let aggregatedValue
      const values = group.values

      switch (config.aggregation) {
        case "sum":
          aggregatedValue = values.reduce((sum: number, val: number) => sum + val, 0)
          break
        case "avg":
          aggregatedValue = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
          break
        case "count":
          aggregatedValue = values.length
          break
        case "max":
          aggregatedValue = Math.max(...values)
          break
        case "min":
          aggregatedValue = Math.min(...values)
          break
        default:
          aggregatedValue = values.reduce((sum: number, val: number) => sum + val, 0)
      }

      return {
        [config.xAxis]: group[config.xAxis],
        [config.yAxis]: aggregatedValue,
      }
    })
  }, [data, config])

  const chartConfig = {
    [config.yAxis]: {
      label: config.yAxis,
      color: config.colors?.[0] || "hsl(var(--chart-1))",
    },
  }
  const renderChart = () => {
    const commonMargin = { top: 20, right: 30, left: 20, bottom: 20 }
    const horizontalMargin = { top: 20, right: 30, left: 80, bottom: 20 }
    
    switch (config.type) {
      case "bar":
        return (
          <BarChart data={processedData} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis}
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`
                return `₩${value}`
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={config.yAxis} fill={`var(--color-${config.yAxis})`} radius={4} />
          </BarChart>
        )

        case "line":
        return (
          <LineChart data={processedData} margin={commonMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xAxis}
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
              />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `₩${formatK(value)}K`
                return `₩${value}`
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey={config.yAxis}
              stroke={`var(--color-${config.yAxis})`}
              strokeWidth={2}
              dot={{ fill: `var(--color-${config.yAxis})`, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        )
        
      case "horizontalBar":
        return (
          <BarChart data={processedData} layout="horizontal" margin={horizontalMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`
                return `₩${value}`
              }}
              />
            <YAxis type="category" dataKey={config.xAxis} tick={{ fontSize: 12 }} width={70} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={config.yAxis} fill={`var(--color-${config.yAxis})`} radius={[0, 4, 4, 0]} />
          </BarChart>
        )

        case "pie":
          return (
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              outerRadius="70%"
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              label={({ name, percent }) =>
                processedData.length <= 6 ? `${name} ${((percent ?? 0) * 100).toFixed(0)}%`:`${((percent ?? 0) * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={config.colors?.[index % (config.colors?.length || 1)] || `hsl(var(--chart-${(index % 6) + 1}))`}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        )

      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            지원하지 않는 차트 유형입니다
          </div>
        )
    }
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        {renderChart()}
      </ResponsiveContainer>
    </ChartContainer>
  )
}
