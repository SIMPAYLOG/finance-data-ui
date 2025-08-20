"use client"

import { useMemo } from "react";
import { useApi } from "./useApi";

interface UseChartDataProps<T> {
  endpoint: string | null;
  params?: Record<string, any>;
  transformData: (data: any) => T[];
  refreshKey: number;
}

export function useChartData<T>({ endpoint, params, transformData, refreshKey }: UseChartDataProps<T>) {
  const { data: rawData, isLoading, error } = useApi<any>({
    endpoint,
    params,
    refreshKey,
  });

  const transformedData = useMemo(() => {
    if (!rawData) return [];
    try {
      return transformData(rawData);
    } catch (e) {
      console.error("데이터 변환 실패:", e);
      return [];
    }
  }, [rawData, transformData]);

  return { data: transformedData, isLoading, error };
}