"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Settings, Download, Maximize } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ChartEditor } from "@/components/chart-editor"

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  chartType?: "bar" | "line" | "pie" | "horizontalBar" | "groupedBar"
  userId? : string
}

const chartTypeColors = {
  bar: "bg-blue-100 text-blue-800",
  line: "bg-green-100 text-green-800",
  pie: "bg-purple-100 text-purple-800",
  horizontalBar: "bg-orange-100 text-orange-800",
  groupedBar: "bg-pink-100 text-pink-800",
}

const chartTypeLabels = {
  bar: "Bar Chart",
  line: "Line Chart",
  pie: "Pie Chart",
  horizontalBar: "Horizontal Bar",
  groupedBar: "Grouped Bar",
}

export function ChartCard({ title, description, children, className, chartType, userId }: ChartCardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [chartConfig, setChartConfig] = useState({
    type: chartType || "bar",
    xAxis: "month",
    yAxis: "amount",
    aggregation: "sum",
    groupBy: "",
    filters: [],
  })

  return (
    <Card className={cn("relative group", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{title}</CardTitle>
              {chartType && (
                <Badge variant="secondary" className={chartTypeColors[chartType]}>
                  {chartTypeLabels[chartType]}
                </Badge>
              )}
            </div>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  차트 편집
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsCustomizing(!isCustomizing)}>
                  <Settings className="h-4 w-4 mr-2" />
                  빠른 설정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  이미지 다운로드
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize className="h-4 w-4 mr-2" />
                  전체화면
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {isCustomizing && (
          <div className="mb-4 p-3 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground">빠른 설정 옵션이 여기에 표시됩니다</p>
          </div>
        )}
        <div className="w-full h-[300px] min-h-[250px] max-h-[400px]">{children}</div>
      </CardContent>

      {/* {isEditing && (
        <ChartEditor
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          config={chartConfig}
          onConfigChange={setChartConfig}
          title={title}
        />
      )} */}
    </Card>
  )
}
