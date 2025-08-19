"use client"

import { useEffect, useRef, useState } from "react"
import { ChartCard } from "@/components/chart-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { GroupComparisonChart } from "@/components/charts/group-comparison-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useSessionStore } from "@/store/useSessionStore"

interface User {
  userId: number
  name: string
  age: number
  preferenceId: string
  occupationName: string
  gender: string
}

interface SummaryData {
  transactionType: "WITHDRAW" | "DEPOSIT"
  amount: number
}

interface Summary {
  data: SummaryData[]
}

interface UserComparisonProps {
  filters: any
}

export function UserComparison({ filters }: UserComparisonProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [overallSummary, setOverallSummary] = useState<Summary | null>(null)
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const pageSize = 10

  // --- 전체 유저 로드 ---
  const loadUsers = async () => {
    if (!hasMore) return
    const res = await fetch(
      `http://localhost:8080/api/users/list?sessionId=${sessionId}&page=${page}&size=${pageSize}`
    )
    const data = await res.json()
    setUsers((prev) => {
      const updatedUsers = [...prev, ...data.result.content]
      
      // 첫 페이지 로드 시, selectedUser가 없으면 첫 번째 유저 자동 선택
      if (page === 0 && updatedUsers.length > 0 && !selectedUser) {
        handleSelectUser(updatedUsers[0])
      }

      return updatedUsers
    })
    setHasMore(!data.result.last)
    setPage((prev) => prev + 1)
  }


  useEffect(() => {
    loadUsers()
  }, [sessionId])

  // --- 전체 Summary 로드 ---
  useEffect(() => {
    if (!filters.dateRange) return
    const { start, end } = filters.dateRange
    fetch(
      `http://localhost:8080/api/analysis/amount-avg/by-transaction-type?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}`
    )
      .then((res) => res.json())
      .then((data) => setOverallSummary(data.result))
  }, [sessionId, filters.dateRange])

  // --- 선택 사용자 Summary 로드 ---
  useEffect(() => {
    if (!selectedUser || !filters.dateRange) return
    const { start, end } = filters.dateRange
    fetch(
      `http://localhost:8080/api/analysis/amount-avg/by-transaction-type?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&userId=${selectedUser.userId}`
    )
      .then((res) => res.json())
      .then((data) => setSelectedSummary(data.result))
  }, [selectedUser, sessionId, filters.dateRange])

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

  // --- 카드에서 보여줄 값 계산 함수 ---
  const getTransactionAmount = (summary: Summary | null, type: string) => {
    if (!summary) return 0
    const t = type === "all" ? "WITHDRAW" : type
    return summary.data.find((d) => d.transactionType === t)?.amount ?? 0
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="사용자 비교 분석"
        description="개별 사용자와 유사 집단을 비교하여 소비 패턴의 차이점을 분석합니다"
      />

      {/* 비교 대상 설정 카드 */}
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
              {selectedUser
                ? `${selectedUser.name} (${selectedUser.userId})`
                : "사용자 선택"}
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

      {/* 비교 결과 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 평균 대비 총 지출/수입 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {filters.transactionType === "DEPOSIT" ? "평균 대비 총 수입" : "평균 대비 총 지출"}
            </CardDescription>
            <CardTitle className="text-2xl">
              {(() => {
                const type = filters.transactionType
                const overall = getTransactionAmount(overallSummary, type)
                const selected = getTransactionAmount(selectedSummary, type)
                return overall === 0 ? 0 : Math.round(((selected - overall) / overall) * 100)
              })()}
              %
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-orange-600 bg-orange-50">
              {(() => {
                const type = filters.transactionType
                const overall = getTransactionAmount(overallSummary, type)
                const selected = getTransactionAmount(selectedSummary, type)
                const diff = selected - overall
                return `전체 대비 ${diff}원`
              })()}
            </Badge>
          </CardContent>
        </Card>

        {/* 집단 평균 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {filters.transactionType === "DEPOSIT" ? "집단 평균 수입" : "집단 평균 지출"}
            </CardDescription>
            <CardTitle className="text-2xl">
              {getTransactionAmount(overallSummary, filters.transactionType)?.toLocaleString()}원
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 나의 평균 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {filters.transactionType === "DEPOSIT" ? "나의 평균 수입" : "나의 평균 지출"}
            </CardDescription>
            <CardTitle className="text-2xl">
              {getTransactionAmount(selectedSummary, filters.transactionType)?.toLocaleString()}원
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 집단 규모 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>비교 집단 규모</CardDescription>
            <CardTitle className="text-2xl">100명</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 상세 비교 차트 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="👥 카테고리별 지출 비교"
          description="선택된 사용자와 유사 집단의 카테고리별 지출을 비교합니다"
          chartType="groupedBar"
        >
          <GroupComparisonChart />
        </ChartCard>

        <ChartCard
          title="📊 월별 지출 트렌드 비교"
          description="최근 6개월간의 지출 트렌드를 집단과 비교합니다"
          chartType="line"
        >
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            월별 트렌드 비교 차트 (구현 예정)
          </div>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>상세 비교 리포트</CardTitle>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
