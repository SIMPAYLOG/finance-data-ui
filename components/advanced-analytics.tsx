"use client"

import { ChartCard } from "@/components/chart-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react"

export function AdvancedAnalytics() {
  const insights = [
    {
      type: "warning",
      title: "식비 지출 급증 감지",
      description: "최근 3개월간 외식비가 월 평균 15% 증가하고 있습니다.",
      icon: AlertTriangle,
      color: "border-orange-200 bg-orange-50",
    },
    {
      type: "success",
      title: "저축률 개선",
      description: "목표 저축률 20%를 달성했습니다. 현재 저축률: 23%",
      icon: CheckCircle,
      color: "border-green-200 bg-green-50",
    },
    {
      type: "info",
      title: "소비 패턴 변화",
      description: "온라인 쇼핑 비중이 전체 쇼핑의 65%로 증가했습니다.",
      icon: Info,
      color: "border-blue-200 bg-blue-50",
    },
  ]

  const correlationData = [
    { factor: "급여일", correlation: 0.89, impact: "매우 높음" },
    { factor: "계절성", correlation: 0.67, impact: "높음" },
    { factor: "요일", correlation: 0.45, impact: "보통" },
    { factor: "날씨", correlation: 0.23, impact: "낮음" },
  ]

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader title="고급 분석" description="AI 기반 패턴 분석과 예측 모델을 통한 상세 인사이트" />

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI 인사이트</TabsTrigger>
          <TabsTrigger value="predictions">예측 분석</TabsTrigger>
          <TabsTrigger value="correlations">상관관계 분석</TabsTrigger>
          <TabsTrigger value="anomalies">이상 탐지</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={insight.color}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <insight.icon className="h-5 w-5" />
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <ChartCard title="다음 달 지출 예측" description="머신러닝 모델을 통한 카테고리별 지출 예측" chartType="line">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              예측 차트가 여기에 표시됩니다 (구현 예정)
            </div>
          </ChartCard>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>소비 패턴 상관관계</CardTitle>
              <CardDescription>다양한 요인이 소비에 미치는 영향 분석</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.factor}</p>
                        <p className="text-sm text-muted-foreground">상관계수: {item.correlation}</p>
                      </div>
                    </div>
                    <Badge
                      variant={item.correlation > 0.7 ? "default" : item.correlation > 0.4 ? "secondary" : "outline"}
                    >
                      {item.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <ChartCard
            title="지출 패턴 이상 탐지"
            description="평소와 다른 소비 패턴을 자동으로 탐지합니다"
            chartType="line"
          >
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              이상 탐지 차트가 여기에 표시됩니다 (구현 예정)
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
