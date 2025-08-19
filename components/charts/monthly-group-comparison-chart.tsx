"use client"

import { useEffect, useState, useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSessionStore } from "@/store/useSessionStore"

interface PeriodData {
  key: string
  totalSpentCount: number
  spentAmountSum: number
  totalIncomeCount: number
  incomeAmountSum: number
}

interface PeriodAmountChartProps {
  filters: any
  userId?: number | null
}

export function PeriodAmountChart({ filters, userId }: PeriodAmountChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const [groupData, setGroupData] = useState<PeriodData[]>([])
  const [userData, setUserData] = useState<PeriodData[]>([])

  const start = filters?.dateRange?.start
  const end = filters?.dateRange?.end
  const transactionType = filters?.transactionType ?? "all"

  // --- 그룹 데이터 로드 ---
  useEffect(() => {
    if (!start || !end) return

    fetch(
      `http://localhost:8080/api/analysis/search-period-amount?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&interval=month`
    )
      .then((res) => res.json())
      .then((data) => setGroupData(data.result.data))
      .catch((err) => console.error("그룹 데이터 로드 실패:", err))
  }, [sessionId, start, end])

  // --- 개인 데이터 로드 ---
  useEffect(() => {
    if (!start || !end || !userId) return

    fetch(
      `http://localhost:8080/api/analysis/search-period-amount?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&interval=month&userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => setUserData(data.result.data))
      .catch((err) => console.error("개인 데이터 로드 실패:", err))
  }, [sessionId, start, end, userId])

  // --- 주어진 기간의 모든 월 생성 ---
  const monthKeys = useMemo(() => {
    if (!start || !end) return []
    const startDate = new Date(start)
    const endDate = new Date(end)

    const months: string[] = []
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

    while (current <= endDate) {
      const ym = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`
      months.push(ym)
      current.setMonth(current.getMonth() + 1)
    }

    return months
  }, [start, end])

  // --- 그룹 & 개인 데이터 매핑 ---
  const mergedData = monthKeys.map((ym) => {
    const g = groupData.find((d) => d.key.startsWith(ym)) // "2025-08-01" → "2025-08"
    const u = userData.find((d) => d.key.startsWith(ym))
    let groupAmount = 0
    let myAmount = 0

    if (transactionType === "all" || transactionType === "WITHDRAW") {
      groupAmount = g?.spentAmountSum ?? 0
      myAmount = u?.spentAmountSum ?? 0
    } else if (transactionType === "DEPOSIT") {
      groupAmount = g?.incomeAmountSum ?? 0
      myAmount = u?.incomeAmountSum ?? 0
    }

    return {
      month: ym, // X축 라벨용
      groupAmount,
      myAmount,
    }
  })

  return (
    <ChartContainer
      config={{
        myAmount: { label: transactionType === "DEPOSIT" ? "내 수입" : "내 지출", color: "hsl(var(--chart-1))" },
        groupAmount: { label: transactionType === "DEPOSIT" ? "그룹 수입" : "그룹 지출", color: "hsl(var(--chart-2))" },
      }}
      className="h-[400px]"
    >
      <div className="flex flex-col h-full">
        {/* 범례 */}
        <div className="flex justify-start gap-4 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-[var(--color-myAmount)]"></div>
            <span className="text-sm">{transactionType === "DEPOSIT" ? "내 수입" : "내 지출"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-[var(--color-groupAmount)]"></div>
            <span className="text-sm">{transactionType === "DEPOSIT" ? "그룹 수입" : "그룹 지출"}</span>
          </div>
        </div>

        {/* 차트 */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mergedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }} // ✅ bottom 여백 크게
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              interval={0}
              angle={-45} // ✅ 라벨 기울여 표시
              textAnchor="end"
              tickFormatter={(val) => {
                const [, m] = val.split("-")
                return `${parseInt(m, 10)}월`
              }}
            />
            <YAxis tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`₩${value.toLocaleString()}`, ""]}
            />
            <Bar dataKey="myAmount" fill="var(--color-myAmount)" radius={4} />
            <Bar dataKey="groupAmount" fill="var(--color-groupAmount)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
