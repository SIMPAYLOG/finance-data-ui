"use client"

import { useState, useEffect, useRef } from "react";
import { ChartCard } from "@/components/chart-card"
import TopCategoriesChart from "@/components/charts/top-categories-chart"
import { KPICards } from "@/components/kpi-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import IncomeExpensesCharByPreference from "@/components/charts/income-expenses-preference"
import IncomeExpensesCharByMonth from "@/components/charts/income-expenses-by-month"
import { CustomChart } from "@/components/custom-chart"
import { useSessionStore } from "@/store/useSessionStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  userId: number
  name: string
  age: number
  preferenceId: string
  occupationName: string
  gender: string
}

interface UserAnalysisProps {
  filters: any;
}

export function UserAnalysis({ filters }: UserAnalysisProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const sessionId = useSessionStore((state) => state.sessionId)

    // 무한 스크롤 & 드롭다운
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const pageSize = 10

  // --- 전체 유저 로드 ---
const loadUsers = async () => {
  if (!hasMore) return
  try {
    const res = await fetch(
      `http://localhost:8080/api/users/list?sessionId=${sessionId}&page=${page}&size=${pageSize}`
    )

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    setUsers((prev) => {
      const updatedUsers = [...prev, ...data.result.content]
      if (page === 0 && updatedUsers.length > 0 && !selectedUser) {
        handleSelectUser(updatedUsers[0])
      }
      return updatedUsers
    })

    setHasMore(!data.result.last)
    setPage((prev) => prev + 1)
  } catch (error) {
    console.error("❌ Failed to load users:", error)

    // 실패했을 때도 데이터 형식을 유지하도록 빈 배열 반환
    setUsers((prev) => {
      const updatedUsers: typeof prev = [...prev] // 기존값 유지
      if (page === 0) {
        // 첫 페이지라면 빈 배열로 초기화
        return []
      }
      return updatedUsers // 이후 페이지라면 그냥 기존 유지
    })

    setHasMore(false) // 더 이상 불러오지 않게 막음
  }
}



  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // --- 무한 스크롤 ---
  const handleScroll = () => {
    if (!listRef.current || !hasMore) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadUsers()
    }
  }

  // --- 사용자 선택 ---
  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setIsOpen(false)
    // NOTE: 외부 필터 객체에 값 반영 (기존 동작 유지)
    filters.age = user.age
    filters.gender = user.gender === "M" ? "남자" : "여자"
    filters.occupationName = user.occupationName
    filters.preference = user.preferenceId
  }

  // --- 드롭다운 외부 클릭 시 닫기 ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="트랜잭션 분석 대시보드"
        description="개인 및 집단 사용자의 금융 데이터를 종합적으로 분석합니다"
      />

    {/* 비교 대상 설정 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>비교 대상 설정</CardTitle>
              <CardDescription>분석할 사용자와 비교할 집단을 선택하세요</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 사용자 선택 드롭다운 */}
          <div className="relative w-full" ref={dropdownRef}>
            <button
              type="button"
              className="w-full border rounded-md p-2 text-left bg-white"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {selectedUser ? `${selectedUser.name}` : "사용자 선택"}
            </button>

            {isOpen && (
              <div
                ref={listRef}
                onScroll={handleScroll}
                className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border rounded-md bg-white shadow-lg"
              >
                {users.map((user, idx) => (
                  <div
                    key={idx}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.name} ({user.occupationName})
                  </div>
                ))}
                {!hasMore && (
                  <div className="text-center text-gray-400 py-2">모든 사용자 로드 완료</div>
                )}
              </div>
            )}
          </div>

          {/* 선택된 사용자 정보 */}
          {selectedUser && (
            <>
              <div className="p-2 bg-gray-50 rounded-md border">나이: {selectedUser.age}대</div>
              <div className="p-2 bg-gray-50 rounded-md border">직업: {filters.occupationName}</div>
              <div className="p-2 bg-gray-50 rounded-md border">소비 성향: {filters.preference}</div>
            </>
          )}
        </CardContent>
      </Card>

      <KPICards filters={filters} refreshKey={refreshKey} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="min-w-0">
          <ChartCard
            title="📊 월별 수입/지출 비교"
            description="설정된 기간의 수입과 지출을 비교합니다"
            chartType="groupedBar"
          >
            <IncomeExpensesCharByMonth isLoading={isLoading} filters={filters}/>
          </ChartCard>
        </div>

        <div className="min-w-0">
          <CustomChart
            title="🧁 카테고리별 지출 비중"
            description="주요 지출 카테고리별 비중을 보여줍니다"
            initialConfig={{
              type: "pie",
              xAxis: "category",
              yAxis: "income",
              aggregation: "sum",
              colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
              }}
            filters={filters}
            mappingUrl="/api/analysis/all-category-info"
          />
        </div>
        
      </div>

      <div className="min-w-0">
        <CustomChart
          title="📈 시간 흐름에 따른 평균 지출액 변화"
          description="시간별 평균 지출액 추이를 확인할 수 있습니다"
          initialConfig={{
            type: "line",
            xAxis: "hour",
            yAxis: "avgSpentAmount",
            aggregation: "avg",
            colors: ["hsl(var(--chart-3))"],
          }}
          filters={filters}
          mappingUrl="/api/analysis/amount-avg/by-hour"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="min-w-0">
          <ChartCard
            title="💡 상위 소비 카테고리 TOP 5"
            description="가장 많이 지출한 카테고리를 확인합니다"
          >
            <TopCategoriesChart isLoading={isLoading} filters={filters}/>
          </ChartCard>
        </div>

        <div className="min-w-0">
          <ChartCard
            title="👥 소비집단 평균 비교"
            description="소비집단 간의 소비 패턴을 비교합니다"
            chartType="groupedBar"
          >
            <IncomeExpensesCharByPreference isLoading={isLoading} filters={filters}/>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
