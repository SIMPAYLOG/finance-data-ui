"use client"

import { ResponsiveContainer } from "recharts"
import { useSessionStore } from "@/store/useSessionStore"
import { useMemo, useCallback } from "react"
import { useChartData } from "@/app/analyze/hooks/useChartData"

interface HeatmapChartProps {
  filters: any;
  isLoading: boolean;
  refreshKey: number;
  userId?: string;
}

interface HeatmapData {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export default function HeatmapChart({
  filters,
  refreshKey,
  userId,
}: HeatmapChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId);

  const endpoint = "/api/analysis/time-heatmap";

  const params = useMemo(() => {
    if (!sessionId || !filters?.dateRange?.start) return undefined;
    
    const paramsObject: Record<string, string> = {
      sessionId,
      durationStart: filters.dateRange.start,
      durationEnd: filters.dateRange.end,
    };
    if (userId) {
      paramsObject.userId = userId;
    }
    return paramsObject;
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange?.end, userId]);

  const transformData = useCallback((result: any) => {
    return result?.data || [];
  }, []);

  const { data, isLoading: loading, error } = useChartData<HeatmapData>({
    endpoint: params ? endpoint : null,
    params,
    transformData,
    refreshKey,
  });

 const days = ["월", "화", "수", "목", "금", "토", "일"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensity = (day: number, hour: number) => {
    const point = data.find((d) => d.dayOfWeek === day + 1 && d.hour === hour);
    if (!point) return 0;
    const max = Math.max(...data.map((d) => d.count)) || 1;
    return point.count / max;
  };



  const getColor = (intensity: number) => {
    if (intensity > 0.7) return "bg-red-500"
    if (intensity > 0.5) return "bg-orange-400"
    if (intensity > 0.3) return "bg-yellow-400"
    if (intensity > 0.1) return "bg-green-300"
    return "bg-gray-200"
  }

  return (
    <ResponsiveContainer width="100%" height="100%">

      {loading ? (
            <div className="flex justify-center items-center h-[350px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* <div className="grid grid-cols-8 ml-8">
                {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                  <div key={hour} className="text-xs text-muted-foreground w-6 text-center">
                    {hour}
                  </div>
                ))}
              </div> */}
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
    </ResponsiveContainer>
  )
}