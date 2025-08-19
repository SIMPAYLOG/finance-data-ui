"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSessionStore } from "@/store/useSessionStore"

interface CategoryData {
  categoryType: string
  amount: number
}

interface ApiResponse {
  result: {
    data: CategoryData[]
  }
}

interface GroupComparisonChartProps {
  filters: any
  userId?: number | null
}

// ✅ 카테고리 매핑 테이블
const CATEGORY_LABELS: Record<string, string> = {
  groceriesNonAlcoholicBeverages: "식료품 및 비알콜음료",
  transportation: "교통",
  foodAccommodation: "음식 및 숙박",
  otherGoodsServices: "기타 상품 및 서비스",
  alcoholicBeveragesTobacco: "주류 및 담배",
  recreationCulture: "여가 및 문화",
  clothingFootwear: "의류 및 신발",
  health: "보건",
  householdGoodsServices: "가정용품 및 서비스",
  education: "교육",
}

export function GroupComparisonChart({ filters, userId }: GroupComparisonChartProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const [groupData, setGroupData] = useState<CategoryData[]>([])
  const [userData, setUserData] = useState<CategoryData[]>([])

  const start = filters?.dateRange?.start;
  const end = filters?.dateRange?.end;

  //그룹 데이터 가져오기
  useEffect(() => {
    if (!start || !end) return; // start, end 없으면 실행 안 함

    fetch(
      `http://localhost:8080/api/analysis/category/by-userId?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}`
    )
      .then((res) => res.json())
      .then((data: ApiResponse) => setGroupData(data.result.data))
      .catch((err) => console.error("그룹 데이터 로드 실패:", err));
  }, [sessionId, start, end]);


  // --- 개인 데이터 로드 (userId 또는 dateRange 변경 시) ---
  useEffect(() => {
    if (!start || !end || !userId) return;

    fetch(
      `http://localhost:8080/api/analysis/category/by-userId?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&userId=${userId}`
    )
      .then((res) => res.json())
      .then((data: ApiResponse) => setUserData(data.result.data))
      .catch((err) => console.error("개인 데이터 로드 실패:", err));
  }, [sessionId, start, end, userId]);


  // --- 그룹 & 개인 데이터 매핑 ---
  const mergedData = groupData.map((g) => {
    const u = userData.find((ud) => ud.categoryType === g.categoryType)
    return {
      category: CATEGORY_LABELS[g.categoryType] ?? g.categoryType, // ✅ 한글 매핑 적용
      groupAvg: g.amount,
      myAmount: u?.amount ?? 0,
    }
  })

  return (
      <ChartContainer
      config={{
        myAmount: { label: "내 지출", color: "hsl(var(--chart-1))" },
        groupAvg: { label: "그룹 평균", color: "hsl(var(--chart-2))" },
      }}
      className="h-[400px]"
    >
      <div className="flex flex-col h-full">
        {/* 범례 */}
        <div className="flex justify-start gap-4 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-[var(--color-myAmount)]"></div>
            <span className="text-sm">내 지출</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-sm bg-[var(--color-groupAvg)]"></div>
            <span className="text-sm">그룹 평균</span>
          </div>
        </div>

        {/* 차트 */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mergedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              interval={0}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
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
)
}
