"use client"

import { useState, useCallback, useEffect } from 'react';
import { useSessionStore } from '@/store/useSessionStore';

interface Transaction {
  timestamp: string;
  category: string;
  description: string;
  amount: number;
  transactionType: string;
}

interface UseInfiniteTransactionsProps {
  filters: any;
  userId: string | undefined;
  refreshKey?: number;
}

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/transaction-history`;

export function useInfiniteTransactions({
  filters,
  userId,
  refreshKey = 0
}: UseInfiniteTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchAfter, setSearchAfter] = useState<string[] | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useSessionStore((state) => state.sessionId); // 1. sessionId 가져오기

  // 2. 데이터 fetching 로직을 별도 함수로 분리
  const fetchTransactions = useCallback(async (currentSearchAfter: string[] | null) => {
    if (!userId || !sessionId || !filters.dateRange.start) {
      setHasMore(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        sessionId,
        durationStart: filters.dateRange.start,
        durationEnd: filters.dateRange.end,
        userId: parseInt(userId, 10),
        searchAfter: currentSearchAfter,
      };

      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error('서버 응답 오류가 발생했습니다.');

      const data = await res.json();
      if (data.status.code !== 'SUCCESS') {
        throw new Error(data.status.message || 'API 처리 중 에러가 발생했습니다.');
      }

      const newTransactions = data.result?.transactions || [];
      const nextSearchAfter = data.result?.nextSearchAfter || null;

      // 첫 페이지인 경우 데이터를 새로 설정, 아닐 경우 기존 데이터에 추가
      setTransactions((prev) => currentSearchAfter ? [...prev, ...newTransactions] : newTransactions);
      setSearchAfter(nextSearchAfter);
      setHasMore(nextSearchAfter !== null && nextSearchAfter.length > 0);

    } catch (err: any) {
      console.error('트랜잭션 조회 실패:', err);
      setError(err.message || '데이터 조회 중 오류가 발생했습니다.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters, sessionId]);

  // 3. props (refreshKey 등) 변경 시 첫 페이지를 다시 불러오는 useEffect
  useEffect(() => {
    // props가 변경되면 첫 페이지부터 다시 로드
    fetchTransactions(null); 
  }, [refreshKey, userId, filters, fetchTransactions]);

  // 4. loadMore 함수는 다음 페이지를 불러오는 역할만 담당
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchTransactions(searchAfter);
    }
  }, [isLoading, hasMore, searchAfter, fetchTransactions]);

  return { transactions, isLoading, error, hasMore, loadMore };
}