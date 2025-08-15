"use client"

import { ChartCard } from "@/components/chart-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { GroupComparisonChart } from "@/components/charts/group-comparison-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, Download } from "lucide-react"

export function UserComparison() {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="사용자 비교 분석"
        description="개별 사용자와 유사 집단을 비교하여 소비 패턴의 차이점을 분석합니다"
      />

      {/* 비교 설정 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>비교 대상 설정</CardTitle>
              <CardDescription>분석할 사용자와 비교할 집단을 선택하세요</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              사용자 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select defaultValue="user-1">
            <SelectTrigger>
              <SelectValue placeholder="사용자 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user-1">김민수 (ID: 1001)</SelectItem>
              <SelectItem value="user-2">이영희 (ID: 1002)</SelectItem>
              <SelectItem value="user-3">박철수 (ID: 1003)</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="age-30s">
            <SelectTrigger>
              <SelectValue placeholder="연령대" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age-20s">20대</SelectItem>
              <SelectItem value="age-30s">30대</SelectItem>
              <SelectItem value="age-40s">40대</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="income-middle">
            <SelectTrigger>
              <SelectValue placeholder="소득 분위" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income-low">1-3분위</SelectItem>
              <SelectItem value="income-middle">4-7분위</SelectItem>
              <SelectItem value="income-high">8-10분위</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="spending-balanced">
            <SelectTrigger>
              <SelectValue placeholder="소비 성향" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spending-oriented">소비지향형</SelectItem>
              <SelectItem value="saving-oriented">저축지향형</SelectItem>
              <SelectItem value="spending-balanced">균형형</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 비교 결과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>평균 대비 총 지출</CardDescription>
            <CardTitle className="text-2xl">108%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-orange-600 bg-orange-50">
              평균보다 8% 높음
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>저축률 비교</CardDescription>
            <CardTitle className="text-2xl">23%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-green-600 bg-green-50">
              평균보다 5%p 높음
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>소비 패턴 유사도</CardDescription>
            <CardTitle className="text-2xl">76%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
              일반적인 패턴
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>비교 집단 규모</CardDescription>
            <CardTitle className="text-2xl">2,341명</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-purple-600 bg-purple-50">
              충분한 샘플
            </Badge>
          </CardContent>
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              리포트 다운로드
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">강점</h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm">저축률이 동일 집단 평균보다 5%p 높습니다.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm">교통비 관리가 효율적입니다.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">개선 포인트</h4>
              <div className="space-y-2">
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <p className="text-sm">외식비가 집단 평균보다 40% 높습니다.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <p className="text-sm">쇼핑 지출의 변동성이 큽니다.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
