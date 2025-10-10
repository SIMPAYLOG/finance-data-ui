"use client"

import { useState, useEffect, useRef } from "react";
import { ChartCard } from "@/components/chart-card"
import TopCategoriesChart from "@/components/charts/top-categories-chart"
import HeatmapChart from "@/components/charts/heatmap-chart"
import { KPICards } from "@/components/kpi-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import IncomeExpensesCharByMonth from "@/components/charts/income-expenses-by-month"
import { CustomChart } from "@/components/custom-chart"
import { TransactionLog } from "@/components/charts/transaction-log"
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const initialLoad = useRef(true);

  // --- 전체 유저 로드 ---
const loadUsers = async () => {
    // 2. 로딩 중이거나 더 이상 데이터가 없으면 실행 방지
    if (isUsersLoading || !hasMore) return;

    setIsUsersLoading(true); // 로딩 시작

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/list?sessionId=${sessionId}&page=${page}&size=${pageSize}`
      );

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const newUsers = data.result.content;

      // 3. 핵심! 첫 페이지일 경우 덮어쓰기, 아닐 경우 추가하기
      if (page === 0) {
        setUsers(newUsers); // 데이터를 덮어씁니다.
        // 첫 로드 시, 사용자가 아직 선택되지 않았다면 첫 번째 유저를 자동으로 선택합니다.
        if (newUsers.length > 0 && !selectedUser) {
          handleSelectUser(newUsers[0]);
        }
      } else {
        // 중복 데이터가 들어가지 않도록 한 번 더 확인하는 로직 (선택 사항이지만 권장)
        setUsers((prev) => {
          const existingUserIds = new Set(prev.map((u) => u.userId));
          const filteredNewUsers = newUsers.filter((u) => !existingUserIds.has(u.userId));
          return [...prev, ...filteredNewUsers];
        });
      }

      setHasMore(!data.result.last);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load users:", error);
      setHasMore(false);
    } finally {
      setIsUsersLoading(false); // 로딩 종료 (성공/실패 무관)
    }
  };



  useEffect(() => {
    // sessionId가 있을 때만 유저 목록을 불러옵니다.
    if (sessionId && initialLoad.current) {
      initialLoad.current = false; 
      loadUsers();
    }
  }, [sessionId]); // sessionId가 변경될 때 다시 로드

  // --- 무한 스크롤 ---
  const handleScroll = () => {
    if (!listRef.current || !hasMore || isUsersLoading) return; // 로딩 중일 때 스크롤 이벤트 방지
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadUsers();
    }
  };

  // --- 사용자 선택 ---
  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setIsOpen(false)
    
    setRefreshKey(prevKey => prevKey + 1);
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
                <CardTitle>분석 대상 설정</CardTitle>
                <CardDescription>분석할 사용자를 선택하세요</CardDescription>
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
                {selectedUser ? `${selectedUser.name} (${selectedUser.userId})` : "사용자 선택"}
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
                      {user.name} ({user.userId})
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
      {selectedUser ? (
      <>  
      <KPICards filters={filters} refreshKey={refreshKey} userId={selectedUser?.userId} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="min-w-0">
              <ChartCard
                title="📊 월별 수입/지출 비교"
                description="설정된 기간의 수입과 지출을 비교합니다"
                chartType="groupedBar"
              >
                <IncomeExpensesCharByMonth isLoading={isLoading} filters={filters} refreshKey={refreshKey} userId={selectedUser?.userId.toString()}  />
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
                refreshKey={refreshKey}
                filters={filters}
                mappingUrl="/api/analysis/all-category-info"
                userId={selectedUser?.userId.toString()}
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
              refreshKey={refreshKey}
              mappingUrl="/api/analysis/amount-avg/by-hour"
              userId={selectedUser?.userId.toString()}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="min-w-0">
              <ChartCard
                title="💡 상위 소비 카테고리 TOP 5"
                description="가장 많이 지출한 카테고리를 확인합니다"
              >
                <TopCategoriesChart isLoading={isLoading} filters={filters} refreshKey={refreshKey} userId={selectedUser?.userId.toString()}/>
              </ChartCard>
            </div>

            <div className="min-w-0">
              <ChartCard
                title="🗓 요일-시간별 트랜잭션 밀도"
                description="요일-시간별 소비 패턴을 비교합니다"
              >
                <HeatmapChart isLoading={isLoading} filters={filters} refreshKey={refreshKey} userId={selectedUser?.userId.toString()}/>
              </ChartCard>
            </div>
          </div>

          <div className="min-w-0">
            <ChartCard
              title="📜 트랜잭션 상세 로그"
              description="선택된 사용자의 전체 거래 내역을 확인합니다."
            >
              <TransactionLog filters={filters} refreshKey={refreshKey} userId={selectedUser?.userId.toString()}/>
            </ChartCard>
          </div>
      </>
    ) : (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )}
    </div>
  )
}
