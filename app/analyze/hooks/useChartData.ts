import { useEffect, useState, useMemo } from "react";

interface UseChartDataProps<T> {
  fetchUrl: string | null;
  transformData: (data: any) => T[];
}

export function useChartData<T>({ fetchUrl, transformData }: UseChartDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fetchUrl) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error("서버 응답 오류가 발생했습니다.");
        }
        const json = await response.json();
        if (json.status.code !== "SUCCESS") {
          throw new Error(json.status.message || "API 처리 중 에러가 발생했습니다.");
        }

        const transformed = transformData(json.result);
        setData(transformed);

      } catch (err: any) {
        console.error("차트 데이터 조회 실패:", err);
        setError(err.message || "데이터 조회 중 알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl, transformData]);

  return { data, isLoading, error };
}