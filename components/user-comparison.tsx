"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChartCard } from "@/components/chart-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { GroupComparisonChart } from "@/components/charts/group-comparison-chart"
import { PeriodAmountChart } from "@/components/charts/monthly-group-comparison-chart"
import { IncomeCompareChart } from "./charts/income-compare-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// --- 차트용 타입 ---
interface CategoryData {
  categoryType: string
  amount: number
}
interface CategoryApiResponse {
  result: { data: CategoryData[] }
}

interface PeriodData {
  key: string
  totalSpentCount: number
  spentAmountSum: number
  totalIncomeCount: number
  incomeAmountSum: number
}
interface PeriodApiResponse {
  result: { data: PeriodData[] }
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
  housingUtilitiesFuel:  "주거 · 수도 · 광열",
  education: "교육",
}

export function UserComparison({ filters }: UserComparisonProps) {
  const sessionId = useSessionStore((state) => state.sessionId)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [overallSummary, setOverallSummary] = useState<Summary | null>(null)
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)

  // ⬇️ 새로 상위로 올린 상태 (API 결과 저장)
  const [groupCategoryData, setGroupCategoryData] = useState<CategoryData[]>([])
  const [userCategoryData, setUserCategoryData] = useState<CategoryData[]>([])
  const [groupPeriodData, setGroupPeriodData] = useState<PeriodData[]>([])
  const [userPeriodData, setUserPeriodData] = useState<PeriodData[]>([])

  // 무한 스크롤 & 드롭다운
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const pageSize = 10

  const start = filters?.dateRange?.start
  const end = filters?.dateRange?.end
  const transactionType: "WITHDRAW" | "DEPOSIT" | "all" = filters?.transactionType ?? "all"
  const isDeposit = transactionType === "DEPOSIT"

  // --- 유틸 ---
  const fmtPct = (x: number, digits = 1) => `${x.toFixed(digits)}%`
  const pct = (num: number, den: number) => (den === 0 ? 0 : (num / den) * 100)

  // --- 전체 유저 로드 ---
  const loadUsers = async () => {
    if (!hasMore) return
    const res = await fetch(
      `http://localhost:8080/api/users/list?sessionId=${sessionId}&page=${page}&size=${pageSize}`
    )
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
  }

  useEffect(() => {
    loadUsers()
  }, [sessionId])

  // --- Summary 로드 (집단/개인) ---
  useEffect(() => {
    if (!start || !end) return
    fetch(
      `http://localhost:8080/api/analysis/amount-avg/by-transaction-type?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}`
    )
      .then((res) => res.json())
      .then((data) => setOverallSummary(data.result))
  }, [sessionId, start, end])

  useEffect(() => {
    if (!selectedUser || !start || !end) return
    fetch(
      `http://localhost:8080/api/analysis/amount-avg/by-transaction-type?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&userId=${selectedUser.userId}`
    )
      .then((res) => res.json())
      .then((data) => setSelectedSummary(data.result))
  }, [selectedUser, sessionId, start, end])

  // --- 카테고리 데이터 로드 (집단/개인) ---
  useEffect(() => {
    if (!start || !end) return
    fetch(
      `http://localhost:8080/api/analysis/category/by-userId?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}`
    )
      .then((res) => res.json())
      .then((data: CategoryApiResponse) => setGroupCategoryData(data.result.data))
      .catch((err) => console.error("그룹 카테고리 로드 실패:", err))
  }, [sessionId, start, end])

  useEffect(() => {
    if (!start || !end || !selectedUser) return
    fetch(
      `http://localhost:8080/api/analysis/category/by-userId?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&userId=${selectedUser.userId}`
    )
      .then((res) => res.json())
      .then((data: CategoryApiResponse) => setUserCategoryData(data.result.data))
      .catch((err) => console.error("개인 카테고리 로드 실패:", err))
  }, [sessionId, start, end, selectedUser])

  // --- 월별 데이터 로드 (집단/개인) ---
  useEffect(() => {
    if (!start || !end) return
    fetch(
      `http://localhost:8080/api/analysis/search-period-amount?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&interval=month`
    )
      .then((res) => res.json())
      .then((data: PeriodApiResponse) => setGroupPeriodData(data.result.data))
      .catch((err) => console.error("그룹 월별 로드 실패:", err))
  }, [sessionId, start, end])

  useEffect(() => {
    if (!start || !end || !selectedUser) return
    fetch(
      `http://localhost:8080/api/analysis/search-period-amount?sessionId=${sessionId}&durationStart=${start}&durationEnd=${end}&interval=month&userId=${selectedUser.userId}`
    )
      .then((res) => res.json())
      .then((data: PeriodApiResponse) => setUserPeriodData(data.result.data))
      .catch((err) => console.error("개인 월별 로드 실패:", err))
  }, [sessionId, start, end, selectedUser])

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

  // --- 카드에서 보여줄 값 계산 ---
  const getTransactionAmount = (
    summary: Summary | null,
    type: string,
    dateRange: { start: string; end: string }
  ) => {
    if (!summary) return 0

    // 거래 타입 결정
    const t = type === "all" ? "WITHDRAW" : type
    const total = summary.data.find((d) => d.transactionType === t)?.amount ?? 0

    // --- 기간 내 포함된 "월 수" 계산 ---
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    // (연도 차이 * 12 + 월 차이) + 1 → 포함 개월 수
    const monthCount =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1

    // 방어 코드: 최소 1개월은 나누도록
    const divisor = monthCount > 0 ? monthCount : 1

    return Math.round(total / divisor)
  }

  // --- 차트용 병합 데이터 (상위에서 생성해서 내려줌) ---
  const mergedCategory = useMemo(() => {
    return groupCategoryData.map((g) => {
      const u = userCategoryData.find((x) => x.categoryType === g.categoryType)
      return {
        category: CATEGORY_LABELS[g.categoryType] ?? g.categoryType,
        key: g.categoryType,
        groupAvg: g.amount,
        myAmount: u?.amount ?? 0,
      }
    })
  }, [groupCategoryData, userCategoryData])

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

  const mergedPeriod = useMemo(() => {
    return monthKeys.map((ym) => {
      const g = groupPeriodData.find((d) => d.key.startsWith(ym))
      const u = userPeriodData.find((d) => d.key.startsWith(ym))
      let groupAmount = 0
      let myAmount = 0
      if (transactionType === "all" || transactionType === "WITHDRAW") {
        groupAmount = g?.spentAmountSum ?? 0
        myAmount = u?.spentAmountSum ?? 0
      } else if (transactionType === "DEPOSIT") {
        groupAmount = g?.incomeAmountSum ?? 0
        myAmount = u?.incomeAmountSum ?? 0
      }
      return { month: ym, groupAmount, myAmount }
    })
  }, [monthKeys, groupPeriodData, userPeriodData, transactionType])

  // --- 상세 비교 리포트 계산 ---
  const strengths: string[] = []
  const improvements: string[] = []

  if (isDeposit) {
    // 수입(DEPOSIT) -> 흑자율 계산 (100 * (income - expense) / income), 소수점 버림
    const groupDeposit = getTransactionAmount(overallSummary, "DEPOSIT", filters.dateRange)
    const groupWithdraw = getTransactionAmount(overallSummary, "WITHDRAW", filters.dateRange)
    const myDeposit = getTransactionAmount(selectedSummary, "DEPOSIT", filters.dateRange)
    const myWithdraw = getTransactionAmount(selectedSummary, "WITHDRAW", filters.dateRange)

    // 흑자율을 정수(소수점 이하 버림)로 계산
    const groupSurplusRate = groupDeposit === 0 ? 0 : Math.floor(((groupDeposit - groupWithdraw) / groupDeposit) * 100)
    const mySurplusRate = myDeposit === 0 ? 0 : Math.floor(((myDeposit - myWithdraw) / myDeposit) * 100)

    if (mySurplusRate > groupSurplusRate) {
      strengths.push(`흑자율이 같은 집단 대비 ${mySurplusRate - groupSurplusRate}% 높습니다.`)
    } else if (mySurplusRate < groupSurplusRate) {
      improvements.push(`흑자율이 같은 집단 대비 ${groupSurplusRate - mySurplusRate}% 낮습니다.`)
    }
  } else {
    // WITHDRAW | all : 카테고리/월별 소비 비교
    // --- 카테고리 ---
    const lowers = mergedCategory.filter((d) => d.groupAvg > 0 && d.myAmount < d.groupAvg)
    const highers = mergedCategory.filter((d) => d.groupAvg > 0 && d.myAmount > d.groupAvg)

    if (lowers.length > 0) {
      const lowerCatNames = lowers.map((d) => d.category).join(", ")
      // 그룹 대비 절약(그룹Avg - myAmount)의 합 / 그룹 합 => 절약 비율
      const savedSum = lowers.reduce((acc, d) => acc + (d.groupAvg - d.myAmount), 0)
      const baseSum = lowers.reduce((acc, d) => acc + d.groupAvg, 0)
      const savedPct = pct(savedSum, baseSum)
      strengths.push(`${lowerCatNames} 항목에서 소비율이 같은 집단 대비 ${fmtPct(savedPct)} 낮습니다.`)
    }
    if (highers.length > 0) {
      const higherCatNames = highers.map((d) => d.category).join(", ")
      const overSum = highers.reduce((acc, d) => acc + (d.myAmount - d.groupAvg), 0)
      const baseSum = highers.reduce((acc, d) => acc + d.groupAvg, 0)
      const overPct = pct(overSum, baseSum)
      improvements.push(`${higherCatNames} 항목에서 소비율이 같은 집단 대비 ${fmtPct(overPct)} 높습니다.`)
    }

    // --- 월별 ---
    const monthLowers = mergedPeriod.filter((d) => d.groupAmount > 0 && d.myAmount < d.groupAmount)
    const monthHighers = mergedPeriod.filter((d) => d.groupAmount > 0 && d.myAmount > d.groupAmount)

    if (monthLowers.length > 0) {
      const months = monthLowers
        .map((d) => {
          const [, m] = d.month.split("-")
          return `${parseInt(m, 10)}월`
        })
        .join(", ")
      const savedSum = monthLowers.reduce((acc, d) => acc + (d.groupAmount - d.myAmount), 0)
      const baseSum = monthLowers.reduce((acc, d) => acc + d.groupAmount, 0)
      const savedPct = pct(savedSum, baseSum)
      strengths.push(`${months}의 소비율이 같은 집단 대비 ${fmtPct(savedPct)} 낮습니다.`)
    }

    if (monthHighers.length > 0) {
      const months = monthHighers
        .map((d) => {
          const [, m] = d.month.split("-")
          return `${parseInt(m, 10)}월`
        })
        .join(", ")
      const overSum = monthHighers.reduce((acc, d) => acc + (d.myAmount - d.groupAmount), 0)
      const baseSum = monthHighers.reduce((acc, d) => acc + d.groupAmount, 0)
      const overPct = pct(overSum, baseSum)
      improvements.push(`${months}의 소비율이 같은 집단 대비 ${fmtPct(overPct)} 높습니다.`)
    }
  }

  // --- 강점/개선 포인트가 모두 비어있을 경우 통일 문구 넣기 ---
  if (strengths.length === 0 && improvements.length === 0) {
    const unified = "현재 기간에서 눈에 띄는 강점/개선 포인트가 없습니다."
    // 둘 다 존재하지 않으니 양쪽에 같은 문구를 넣어 UI에서 일관되게 표시
    strengths.push(unified)
    improvements.push(unified)
  }

  const diffBadge = (() => {
    const overall = getTransactionAmount(overallSummary, transactionType, filters.dateRange)
    const selected = getTransactionAmount(selectedSummary, transactionType, filters.dateRange)
    const diff = selected - overall
    const isHigher = diff > 0
    const isDepositLocal = isDeposit

    if (isDepositLocal) {
      return (
        <Badge variant="secondary" className={isHigher ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}>
          {isHigher
            ? `수입이 전체 대비 ${diff.toLocaleString()}원 높음`
            : `수입이 전체 대비 ${Math.abs(diff).toLocaleString()}원 낮음`}
        </Badge>
      )
    } else {
      return (
        <Badge variant="secondary" className={isHigher ? "text-blue-600 bg-blue-50" : "text-orange-600 bg-orange-50"}>
          {isHigher
            ? `지출이 전체 대비 ${diff.toLocaleString()}원 높음`
            : `지출이 전체 대비 ${Math.abs(diff).toLocaleString()}원 낮음`}
        </Badge>
      )
    }
  })()

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="사용자 비교 분석"
        description="개별 사용자와 유사 집단을 비교하여 소비 패턴의 차이점을 분석합니다"
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
              <div className="p-2 bg-gray-50 rounded-md border">직업: {selectedUser.occupationName}</div>
              <div className="p-2 bg-gray-50 rounded-md border">소비 성향: {selectedUser.preferenceId}</div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 비교 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 평균 대비 총 지출/수입 증감율 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {isDeposit ? "평균 대비 총 수입" : "평균 대비 총 지출"}
            </CardDescription>
            <CardTitle className="text-2xl">
              {(() => {
                const overall = getTransactionAmount(overallSummary, transactionType, filters.dateRange)
                const selected = getTransactionAmount(selectedSummary, transactionType, filters.dateRange)
                return overall === 0 ? 0 : Math.round(((selected - overall) / overall) * 100)
              })()}
              %
            </CardTitle>
          </CardHeader>
          <CardContent>{diffBadge}</CardContent>
        </Card>

        {/* 집단 평균 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {isDeposit ? "집단 평균 수입" : "집단 평균 지출"}
            </CardDescription>
            <CardTitle className="text-2xl">
              {getTransactionAmount(overallSummary, transactionType, filters.dateRange)?.toLocaleString()}원
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 나의 평균 */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {isDeposit ? "나의 평균 수입" : "나의 평균 지출"}
            </CardDescription>
            <CardTitle className="text-2xl">
              {getTransactionAmount(selectedSummary, transactionType, filters.dateRange)?.toLocaleString()}원
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

      {/* 상세 비교 차트 (데이터 상위에서 내려줌) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title={isDeposit ? "👥 개인/전체 총 수입 비교" : "👥 카테고리별 지출 비교"}
          description={isDeposit ? "선택된 사용자와 전체 집단의 기간 내 총 수입을 비교합니다" : "선택된 사용자와 전체 집단의 카테고리별 지출을 비교합니다"}
        >
          {isDeposit ? (
            <IncomeCompareChart
              overallSummary = {overallSummary}
              selectedSummary = {selectedSummary}
            />
          ) : (
            <GroupComparisonChart
              data={mergedCategory}
              transactionType={transactionType}
            />
          )}
        </ChartCard>

        <ChartCard
          title={isDeposit ? "📊 월별 수입 금액 비교" : "📊 월별 지출 금액 비교"}
          description={isDeposit ? "기간 내 수입 금액을 전체 집단과 비교합니다" : "기간 내 지출 금액을 전체 집단과 비교합니다"}
        >
          <PeriodAmountChart
            data={mergedPeriod}
            transactionType={transactionType}
          />
        </ChartCard>
      </div>

      {/* 상세 비교 리포트 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>상세 비교 리포트</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">강점</h4>
              <div className="space-y-2">
                {strengths.length === 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-200">
                    <p className="text-sm">현재 기간에서 두드러진 강점이 파악되지 않았습니다.</p>
                  </div>
                ) : (
                  strengths.map((s, i) => (
                    <div key={i} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <p className="text-sm">{s}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">개선 포인트</h4>
              <div className="space-y-2">
                {improvements.length === 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-200">
                    <p className="text-sm">현재 기간에서 눈에 띄는 개선 포인트가 없습니다.</p>
                  </div>
                ) : (
                  improvements.map((s, i) => (
                    <div key={i} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <p className="text-sm">{s}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
