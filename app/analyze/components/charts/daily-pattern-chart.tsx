"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"

interface DailyPatternChartProps {
  filters: any
  isEditMode: boolean
  onRemove: () => void
}

export default function DailyPatternChart({ filters, isEditMode, onRemove }: DailyPatternChartProps) {
  const days = ["월", "화", "수", "목", "금", "토", "일"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // 시간대별 거래 빈도 데이터 (0-1 사이 값)
  const getIntensity = (day: number, hour: number) => {
    // 실제로는 API에서 데이터를 가져와야 함
    if (day < 5) {
      // 평일
      if (hour >= 9 && hour <= 18) return Math.random() * 0.8 + 0.2
      if (hour >= 19 && hour <= 22) return Math.random() * 0.6 + 0.3
      return Math.random() * 0.3
    } else {
      // 주말
      if (hour >= 10 && hour <= 22) return Math.random() * 0.7 + 0.2
      return Math.random() * 0.2
    }
  }

  const getColor = (intensity: number) => {
    if (intensity > 0.7) return "bg-red-500"
    if (intensity > 0.5) return "bg-orange-400"
    if (intensity > 0.3) return "bg-yellow-400"
    if (intensity > 0.1) return "bg-green-300"
    return "bg-gray-200"
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          일별 거래 패턴
        </CardTitle>
        {isEditMode && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Hour labels */}
          <div className="flex gap-1 ml-8">
            {[0, 6, 12, 18].map((hour) => (
              <div key={hour} className="text-xs text-muted-foreground w-6 text-center">
                {hour}
              </div>
            ))}
          </div>

          {/* Heatmap */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-1">
              <div className="w-6 text-xs text-muted-foreground">{day}</div>
              <div className="flex gap-1">
                {hours.map((hour) => {
                  const intensity = getIntensity(dayIndex, hour)
                  return (
                    <div
                      key={hour}
                      className={`w-3 h-3 rounded-sm ${getColor(intensity)}`}
                      title={`${day}요일 ${hour}시: ${(intensity * 100).toFixed(0)}%`}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>적음</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-200 rounded-sm" />
              <div className="w-3 h-3 bg-green-300 rounded-sm" />
              <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
              <div className="w-3 h-3 bg-orange-400 rounded-sm" />
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
            </div>
            <span>많음</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
