"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3, TrendingUp, PieChart, Users, List, CalendarDays } from "lucide-react"

interface WidgetSelectorProps {
  onAddWidget: (type: string) => void
}

export default function WidgetSelector({ onAddWidget }: WidgetSelectorProps) {
  const availableWidgets = [
    { type: "daily-comparison", name: "일별 수입/지출 비교", icon: CalendarDays },
    { type: "weekly-comparison", name: "주간별 수입/지출 비교", icon: CalendarDays },
    { type: "monthly-comparison", name: "월별 수입/지출 비교", icon: BarChart3 },
    { type: "balance-trend", name: "잔액 변화 추이", icon: TrendingUp },
    { type: "category-pie", name: "카테고리별 지출 비중", icon: PieChart },
    { type: "collective-comparison", name: "집단 평균 비교", icon: Users },
    { type: "top-categories", name: "상위 소비 카테고리", icon: List },
  ]

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          위젯 추가
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {availableWidgets.map((widget) => (
            <Button
              key={widget.type}
              variant="outline"
              size="sm"
              onClick={() => onAddWidget(widget.type)}
              className="flex items-center gap-2"
            >
              <widget.icon className="h-4 w-4" />
              {widget.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
