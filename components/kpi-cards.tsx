"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, Users } from "lucide-react"

export function KPICards() {
  const kpis = [
    {
      title: "총 수입",
      value: "₩2,450,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "전월 대비",
    },
    {
      title: "총 지출",
      value: "₩1,890,000",
      change: "+8.3%",
      trend: "up",
      icon: CreditCard,
      description: "전월 대비",
    },
    {
      title: "순 저축",
      value: "₩560,000",
      change: "+22.8%",
      trend: "up",
      icon: PiggyBank,
      description: "전월 대비",
    },
    {
      title: "분석 대상자",
      value: "8,452명",
      change: "활성",
      trend: "neutral",
      icon: Users,
      description: "현재 집단",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50"
      case "down":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-sm font-medium">{kpi.title}</CardDescription>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center pt-1">
              <Badge variant="secondary" className={getTrendColor(kpi.trend)}>
                {getTrendIcon(kpi.trend)}
                <span className="ml-1">{kpi.change}</span>
              </Badge>
              <p className="text-xs text-muted-foreground ml-2">{kpi.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
