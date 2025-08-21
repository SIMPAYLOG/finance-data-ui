"use client"

import { useEffect, useState } from "react";

interface UseApiProps {
  endpoint: string | null;
  params?: Record<string, any>;
  refreshKey?: number;
}

export function useApi<T>({ endpoint, params, refreshKey = 0 }: UseApiProps) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) {
      setIsLoading(false);
      return;
    }
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const filteredParams = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null)) : {};
    const queryString = new URLSearchParams(filteredParams).toString();
    const fetchUrl = `${API_BASE_URL}${endpoint}?${queryString}`;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("서버 응답 오류가 발생했습니다.");
        
        const json = await response.json();
        if (json.status.code !== "SUCCESS") throw new Error(json.status.message || "API 처리 중 에러가 발생했습니다.");
        
        setData(json.result); // 가공 전의 순수 result를 저장

      } catch (err: any) {
        console.error("API 조회 실패:", err);
        setError(err.message || "데이터 조회 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint, params, refreshKey]);

  return { data, isLoading, error };
}