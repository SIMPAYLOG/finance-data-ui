"use client"

import { useState } from "react";
import { ChartCard } from "@/components/chart-card"
import { TopCategoriesChart } from "@/components/charts/top-categories-chart"
import { GroupComparisonChart } from "@/components/charts/group-comparison-chart"
import { KPICards } from "@/components/kpi-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import { CustomizableChartCard } from "@/components/customizable-chart-card"

const sampleData = [
  {
    month: "1월",
    amount: 1200000,
    category: "식비",
    income: 2500000,
    expense: 1800000,
    userId: "user1",
    ageGroup: "30대",
  },
  {
    month: "2월",
    amount: 1100000,
    category: "교통비",
    income: 2400000,
    expense: 1900000,
    userId: "user1",
    ageGroup: "30대",
  },
  {
    month: "3월",
    amount: 1300000,
    category: "쇼핑",
    income: 2600000,
    expense: 2100000,
    userId: "user1",
    ageGroup: "30대",
  },
  {
    month: "4월",
    amount: 1000000,
    category: "문화생활",
    income: 2300000,
    expense: 1700000,
    userId: "user1",
    ageGroup: "30대",
  },
  {
    month: "5월",
    amount: 1400000,
    category: "의료비",
    income: 2700000,
    expense: 1950000,
    userId: "user1",
    ageGroup: "30대",
  },
  {
    month: "6월",
    amount: 1250000,
    category: "식비",
    income: 2450000,
    expense: 1890000,
    userId: "user1",
    ageGroup: "30대",
  },
]
interface MainDashboardProps {
  filters: any;
}

export function MainDashboard({ filters }: MainDashboardProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="트랜잭션 분석 대시보드"
        description="개인 및 집단 사용자의 금융 데이터를 종합적으로 분석합니다"
      />

      <KPICards filters={filters} refreshKey={refreshKey} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="min-w-0">
          {" "}
          {/* min-w-0 추가로 flex 아이템이 축소될 수 있도록 */}
          <CustomizableChartCard
            title="📊 월별 수입/지출 비교"
            description="최근 6개월간의 수입과 지출을 비교합니다"
            initialConfig={{
              type: "bar",
              xAxis: "month",
              yAxis: "income",
              aggregation: "sum",
              colors: ["hsl(var(--chart-1))"],
            }}
            data={sampleData}
          />
        </div>

        <div className="min-w-0">
          <CustomizableChartCard
            title="🧁 카테고리별 지출 비중"
            description="주요 지출 카테고리별 비중을 보여줍니다"
            initialConfig={{
              type: "pie",
              xAxis: "category",
              yAxis: "amount",
              aggregation: "sum",
              colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
            }}
            data={sampleData}
          />
        </div>
      </div>

      <div className="min-w-0">
        <CustomizableChartCard
          title="📈 시간 흐름에 따른 잔액 변화"
          description="일별 잔액 변화 추이를 확인할 수 있습니다"
          initialConfig={{
            type: "line",
            xAxis: "month",
            yAxis: "expense",
            aggregation: "avg",
            colors: ["hsl(var(--chart-3))"],
          }}
          data={sampleData}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="min-w-0">
          <ChartCard
            title="💡 상위 소비 카테고리 TOP 5"
            description="가장 많이 지출한 카테고리를 확인합니다"
            chartType="horizontalBar"
          >
            <TopCategoriesChart />
          </ChartCard>
        </div>

        <div className="min-w-0">
          <ChartCard
            title="👥 집단 사용자 평균 비교"
            description="동일 조건 그룹과의 소비 패턴을 비교합니다"
            chartType="groupedBar"
          >
            <GroupComparisonChart />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
