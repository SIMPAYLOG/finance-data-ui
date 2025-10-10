"use client"

import { useSessionStore } from "@/store/useSessionStore"
import { useMemo, useCallback, useEffect, useRef, useState } from "react"
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
  const sessionId = useSessionStore((state) => state.sessionId)

  const endpoint = "/api/analysis/time-heatmap"

  const params = useMemo(() => {
    if (!sessionId || !filters?.dateRange?.start) return undefined
    const paramsObject: Record<string, string> = {
      sessionId,
      durationStart: filters.dateRange.start,
      durationEnd: filters.dateRange.end,
    }
    if (userId) paramsObject.userId = userId
    return paramsObject
  }, [sessionId, filters?.dateRange?.start, filters?.dateRange?.end, userId])

  const transformData = useCallback((result: any) => result?.data || [], [])
  const { data, isLoading: loading } = useChartData<HeatmapData>({
    endpoint: params ? endpoint : null,
    params,
    transformData,
    refreshKey,
  })

  const days = ["월", "화", "수", "목", "금", "토", "일"]
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getIntensity = (day: number, hour: number) => {
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

  // ====== Auto sizing logic ======
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const [cellPx, setCellPx] = useState<number>(12) // 초기값(임시)
  const [gapPx] = useState<number>(8)             // Tailwind gap-2 = 8px
  const labelPx = 32                               // Tailwind w-8 = 32px
  const hourCols = 24
  const dayRows = 7

  useEffect(() => {
    if (!wrapRef.current) return
    const el = wrapRef.current
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      const W = rect.width
      const H = rect.height

      // 헤더(시간 표기) 높이 측정
      const headerH = headerRef.current?.getBoundingClientRect().height ?? 0

      // 가로 기준 셀 크기: (컨테이너 너비 - 라벨 - 총 가로 gap) / 24
      const gx = gapPx
      const totalGapX = gx * (hourCols - 1)
      const availableW = Math.max(0, W - labelPx - totalGapX)
      const cellW = availableW / hourCols

      // 세로 기준 셀 크기: (컨테이너 높이 - 헤더 - 총 세로 gap) / 7
      const gy = gapPx
      const totalGapY = gy * (dayRows - 1)
      const availableH = Math.max(0, H - headerH - totalGapY)
      const cellH = availableH / dayRows

      const cell = Math.floor(Math.max(6, Math.min(cellW, cellH))) // 최소 6px 보장
      setCellPx(cell)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [gapPx])

  return (
    <div
      ref={wrapRef}
      className="w-full h-full relative"
      style={
        {
          // CSS 변수로 내려서 어디서든 참조
          // @ts-ignore
          "--cell": `${cellPx}px`,
          "--gap": `${gapPx}px`,
          "--label": `${labelPx}px`,
        } as React.CSSProperties
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* 시간 헤더 */}
          <div ref={headerRef} className="flex items-center mb-2">
            {/* 좌측 라벨 스페이서(요일 라벨 폭과 동일) */}
            <div className="shrink-0" style={{ width: "var(--label)" }} />
            {/* 24칸 시간 헤더 */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${hourCols}, var(--cell))`,
                columnGap: "var(--gap)",
              }}
            >
              {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
                <div
                  key={h}
                  className="text-[10px] md:text-xs text-muted-foreground text-center"
                  style={{
                    // 해당 시간 위치에만 숫자 표시 (간단하게 nth칸에 배치)
                    gridColumnStart: h + 1, // 0시가 첫 칸
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* 히트맵 바디 (7행) */}
          <div className="flex-1 flex flex-col" style={{ rowGap: "var(--gap)" }}>
            {days.map((day, di) => (
              <div key={day} className="flex items-center">
                {/* 요일 라벨 (폭 고정) */}
                <div
                  className="shrink-0 text-xs text-muted-foreground text-right pr-2"
                  style={{ width: "var(--label)" }}
                >
                  {day}
                </div>

                {/* 24칸 히트맵 셀 */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${hourCols}, var(--cell))`,
                    columnGap: "var(--gap)",
                  }}
                >
                  {hours.map((h) => {
                    const intensity = getIntensity(di, h)
                    return (
                      <div
                        key={h}
                        className={`rounded ${getColor(intensity)}`}
                        style={{
                          width: "var(--cell)",
                          height: "var(--cell)",
                        }}
                        title={`${day}요일 ${h}시: ${(intensity * 100).toFixed(0)}%`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 범례(라벨 정렬 일치) */}
          {/* 범례(카드 가로 중앙 정렬) */}
          <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground w-full">
          {/* 좌측 유령 스페이서: 요일 라벨 폭과 동일 */}
            <div className="shrink-0" style={{ width: "var(--label)" }} />

            {/* 가운데 레전드 블록 */}
            <div className="flex items-center gap-2">
              <span>적음</span>
                <div className="flex" style={{ columnGap: "var(--gap)" }}>
                  <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                  <div className="w-4 h-4 bg-green-300 rounded-sm" />
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
                  <div className="w-4 h-4 bg-orange-400 rounded-sm" />
                  <div className="w-4 h-4 bg-red-500 rounded-sm" />
              </div>
              <span>많음</span>
            </div>

            {/* 우측 유령 스페이서: 좌측과 동일 폭으로 균형 */}
            <div className="shrink-0" style={{ width: "var(--label)" }} />
          </div>
        </div>
      )}
    </div>
  )
}
