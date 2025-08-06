"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"
import { useSessionStore } from "@/store/useSessionStore"
import { useEffect, useState } from "react"

interface HeatmapChartProps {
  filters: any
  isEditMode: boolean
  analysisMode: "individual" | "collective"
  isLoading: boolean
  onRemove: () => void
  onEdit: () => void
}

export default function HeatmapChart({
  filters,
  isEditMode,
  analysisMode,
  isLoading,
  onRemove,
  onEdit,
}: HeatmapChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const [data, setData] = useState<{ dayOfWeek: number; hour: number; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  const days = ["월", "화", "수", "목", "금", "토", "일"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId || !filters?.dateRange?.start || !filters?.dateRange?.end) return
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:8080/api/analysis/time-heatmap?sessionId=${sessionId}&durationStart=${filters.dateRange.start}&durationEnd=${filters.dateRange.end}`
        )
        const json = await res.json()
        setData(json.result.data)
        console.log("json", json);
      } catch (err) {
        console.error("히트맵 데이터 로드 실패", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange?.end])

const getIntensity = (day: number, hour: number) => {
  // dayOfWeek 1~7 → 0~6로 변환 (1은 월요일 → 0, 7은 일요일 → 6)
  const point = data.find((d) => d.dayOfWeek === day && d.hour === hour)
  if (!point) return 0
  const max = Math.max(...data.map((d) => d.count)) || 1
  return point.count / max
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
          요일-시간별 트랜잭션 밀도
          {analysisMode === "collective" && <span className="text-sm text-muted-foreground">(집단 평균)</span>}
        </CardTitle>
        {isEditMode && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-8 ml-8">
              {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                <div key={hour} className="text-xs text-muted-foreground w-6 text-center">
                  {hour}
                </div>
              ))}
            </div>
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2 mb-1">
                <div className="w-8 text-xs text-muted-foreground text-right">{day}</div>
                <div className="flex gap-2">
                  {hours.map((hour) => {
                    const intensity = getIntensity(dayIndex, hour)
                    return (
                      <div
                        key={hour}
                        className={`w-4 h-4 rounded ${getColor(intensity)}`}
                        title={`${day}요일 ${hour}시: ${(intensity * 100).toFixed(0)}%`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>적음</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                <div className="w-4 h-4 bg-green-300 rounded-sm" />
                <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
                <div className="w-4 h-4 bg-orange-400 rounded-sm" />
                <div className="w-4 h-4 bg-red-500 rounded-sm" />
              </div>
              <span>많음</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
