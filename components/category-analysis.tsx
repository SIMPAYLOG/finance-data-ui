"use client"

import { ChartCard } from "@/components/chart-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const categoryTrendData = [
  { month: "1월", food: 420000, transport: 300000, shopping: 280000 },
  { month: "2월", food: 380000, transport: 290000, shopping: 320000 },
  { month: "3월", food: 460000, transport: 310000, shopping: 350000 },
  { month: "4월", food: 440000, transport: 280000, shopping: 290000 },
  { month: "5월", food: 470000, transport: 320000, shopping: 340000 },
  { month: "6월", food: 450000, transport: 280000, shopping: 320000 },
]

const subcategoryData = [
  { name: "외식", value: 280000, change: 12 },
  { name: "마트/편의점", value: 170000, change: -5 },
  { name: "대중교통", value: 180000, change: 0 },
  { name: "택시/카셰어링", value: 100000, change: 25 },
  { name: "의류", value: 200000, change: -8 },
  { name: "전자제품", value: 120000, change: 15 },
]

export function CategoryAnalysis() {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-red-600"
    if (change < 0) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">카테고리 분석</h1>
        <p className="text-muted-foreground">세부 카테고리별 지출 패턴과 트렌드를 분석합니다.</p>
      </div>

      {/* 카테고리별 월간 트렌드 */}
      <ChartCard title="주요 카테고리 월간 트렌드" description="식비, 교통비, 쇼핑 카테고리의 월별 변화를 추적합니다">
        <ChartContainer
          config={{
            food: {
              label: "식비",
              color: "hsl(var(--chart-1))",
            },
            transport: {
              label: "교통비",
              color: "hsl(var(--chart-2))",
            },
            shopping: {
              label: "쇼핑",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={categoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₩${value.toLocaleString()}`, ""]}
              />
              <Line type="monotone" dataKey="food" stroke="var(--color-food)" strokeWidth={3} />
              <Line type="monotone" dataKey="transport" stroke="var(--color-transport)" strokeWidth={3} />
              <Line type="monotone" dataKey="shopping" stroke="var(--color-shopping)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>

      {/* 세부 카테고리 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>세부 카테고리별 지출</CardTitle>
            <CardDescription>전월 대비 변화율과 함께 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subcategoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTrendIcon(item.change)}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">₩{item.value.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getTrendColor(item.change)}>
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>카테고리 인사이트</CardTitle>
            <CardDescription>AI 기반 소비 패턴 분석 결과</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900">식비 증가 패턴 감지</h4>
              <p className="text-sm text-blue-700 mt-1">
                최근 3개월간 외식비가 지속적으로 증가하고 있습니다. 월 평균 12% 증가율을 보이고 있어 주의가 필요합니다.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900">교통비 절약 성공</h4>
              <p className="text-sm text-green-700 mt-1">
                대중교통 이용 증가로 전체 교통비가 안정적으로 유지되고 있습니다.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900">쇼핑 패턴 변화</h4>
              <p className="text-sm text-orange-700 mt-1">
                계절적 요인으로 의류 지출이 감소했지만, 전자제품 구매가 증가하는 추세입니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
