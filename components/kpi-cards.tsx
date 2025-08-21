"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useKpiData, } from "@/app/analyze/hooks/useKpiData"

interface KPICardsProps {
  filters: {
    dateRange: {
      start: string | null;
      end: string | null;
    }
  };
  refreshKey: number;
  userId?: number;
}

export function KPICards({ filters, refreshKey, userId }: KPICardsProps) {
  const { kpis, isLoading, error } = useKpiData({ filters, refreshKey, userId });

  const cardCount = userId ? 3 : 4;
  const gridLayoutClasses = userId 
    ? "md:grid-cols-3 xl:grid-cols-3"
    : "md:grid-cols-2 xl:grid-cols-4";
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 ${gridLayoutClasses} gap-4`}>
        {[...Array(cardCount)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 col-span-4 bg-red-50 text-red-700 rounded-lg">
        <AlertTriangle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${gridLayoutClasses} gap-4`}>
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-sm font-medium">{kpi.title}</CardDescription>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}