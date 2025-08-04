"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface SpendingInsightsProps {
  filters: any
  isEditMode: boolean
  onRemove: () => void
}

export default function SpendingInsights({ filters, isEditMode, onRemove }: SpendingInsightsProps) {
  const insights = [
    {
      type: "positive",
      icon: TrendingDown,
      title: "식비 절약 성공",
      description: "지난달 대비 식비가 15% 감소했습니다. 홈쿡 증가가 주요 원인으로 보입니다.",
      amount: "-120,000원",
      color: "text-green-600",
    },
    {
      type: "warning",
      icon: TrendingUp,
      title: "쇼핑 지출 증가",
      description: "온라인 쇼핑 지출이 평소보다 25% 증가했습니다. 불필요한 구매를 줄여보세요.",
      amount: "+180,000원",
      color: "text-orange-600",
    },
    {
      type: "info",
      icon: AlertTriangle,
      title: "예산 초과 위험",
      description: "이번 달 지출이 예산의 85%에 도달했습니다. 남은 기간 지출 관리가 필요합니다.",
      amount: "85%",
      color: "text-blue-600",
    },
  ]

  const recommendations = [
    "주말 외식 횟수를 줄이고 홈쿡을 늘려보세요",
    "구독 서비스를 정리하여 고정비를 절약하세요",
    "대중교통 이용을 늘려 교통비를 절약하세요",
    "할인 쿠폰과 적립금을 적극 활용하세요",
  ]

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          소비 인사이트 & 추천
        </CardTitle>
        {isEditMode && (
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Insights */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">주요 인사이트</h3>
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge
                      variant={
                        insight.type === "positive"
                          ? "default"
                          : insight.type === "warning"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {insight.amount}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">절약 추천</h3>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
