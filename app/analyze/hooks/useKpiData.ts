"use client"

import { useEffect, useState } from "react";
import { useSessionStore } from "@/store/useSessionStore";
import { DollarSign, CreditCard, PiggyBank, Users } from "lucide-react";

interface UseKpiDataProps {
  filters: {
    dateRange: {
      start: string | null;
      end: string | null;
    }
  };
  refreshKey: number;
  userId?: number;
}

export interface Kpi {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
}

export function useKpiData({ filters, refreshKey, userId }: UseKpiDataProps) {
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useSessionStore((state) => state.sessionId);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!sessionId || !filters?.dateRange?.start) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const baseParams = new URLSearchParams({
          sessionId: sessionId,
          durationStart: filters.dateRange.start!,
          durationEnd: filters.dateRange.end!,
        });
        if (userId) {
          baseParams.append("userId", userId.toString());
        }
        const fetches = [
          fetch(`${API_BASE_URL}/api/analysis/income-expense?${baseParams.toString()}`)
        ];
        if (!userId) {
          fetches.push(fetch(`${API_BASE_URL}/api/users/count?${baseParams.toString()}`));
        }

        const responses = await Promise.all(fetches);

        for (const res of responses) {
          if (!res.ok) throw new Error("서버 응답 오류");
        }

        const [incomeJson, userCountJson] = await Promise.all(responses.map(res => res.json()));

        if (incomeJson.status.code !== "SUCCESS" || (userCountJson && userCountJson.status.code !== "SUCCESS")) {
          throw new Error("API 처리 중 에러 발생");
        }
        
        const formatCurrency = (value: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value || 0);
        
        const transformedData: Kpi[] = [
          { title: "총 수입", value: formatCurrency(incomeJson.result.totalIncome), trend: "neutral", icon: DollarSign },
          { title: "총 지출", value: formatCurrency(incomeJson.result.totalExpense), trend: "neutral", icon: CreditCard },
          { title: "순 저축", value: formatCurrency(incomeJson.result.savings), trend: incomeJson.result.savings >= 0 ? "up" : "down", icon: PiggyBank },
        ];

        if (!userId && userCountJson) {
          transformedData.push({ title: "분석 대상자", value: `${userCountJson.result.totalUserCnt.toLocaleString()}명`, trend: "neutral", icon: Users });
        }

        setKpis(transformedData);

      } catch (err: any) {
        setError(err.message || "데이터 조회 중 오류 발생");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sessionId, refreshKey, filters.dateRange.start, filters.dateRange.end]);

  return { kpis, isLoading, error };
}