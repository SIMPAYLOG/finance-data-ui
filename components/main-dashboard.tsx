"use client"

import { useState } from "react";
import { ChartCard } from "@/components/chart-card"
import TopCategoriesChart from "@/components/charts/top-categories-chart"
import { KPICards } from "@/components/kpi-cards"
import { DashboardHeader } from "@/components/dashboard-header"
import IncomeExpensesCharByPreference from "@/components/charts/income-expenses-preference"
import IncomeExpensesCharByMonth from "@/components/charts/income-expenses-by-month"
import {CustomChart} from "@/components/custom-chart"

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
