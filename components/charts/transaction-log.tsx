"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInfiniteTransactions } from "@/hooks/use-infinite-transactions"
import { AlertTriangle } from "lucide-react"
import { format } from "date-fns"

// props 타입
interface TransactionLogProps {
  filters: any
  userId: string | undefined
  refreshKey?: number
}

const categoryMap: Record<string, string> = {
  groceriesNonAlcoholicBeverages: "식료품 및 비주류 음료",
  alcoholicBeveragesTobacco: "주류 및 담배",
  clothingFootwear: "의류 및 신발",
  housingUtilitiesFuel: "주거 및 공공요금",
  householdGoodsServices: "가정용품 및 서비스",
  health: "보건/의료",
  transportation: "교통",
  communication: "통신",
  recreationCulture: "오락 및 문화",
  education: "교육",
  foodAccommodation: "외식 및 숙박",
  otherGoodsServices: "기타 상품 및 서비스",
}

function TransactionItem({ tx }: { tx: any }) {
  const isWithdraw = tx.transactionType === "WITHDRAW"
  const amountColor = isWithdraw ? "text-red-500" : "text-blue-500"
  const amountPrefix = isWithdraw ? "-" : "+"
  const categoryName = categoryMap[tx.category] ?? tx.category
  return (
    <div className="grid grid-cols-5 items-center p-3 border-b text-sm">
      {/* 날짜 */}
      <div className="text-gray-600">
        {format(new Date(tx.timestamp), "yyyy-MM-dd")}
      </div>
      <div className="text-gray-800">{categoryName}</div>
      <div className="text-gray-800">{tx.description}</div>
      <div className="text-gray-800">{tx.channel}</div>
      <div className={`font-semibold text-right ${amountColor}`}>
        {amountPrefix}
        {tx.amount.toLocaleString()}원
      </div>
    </div>
  )
}

export function TransactionLog({ filters, userId, refreshKey }: TransactionLogProps) {
  const { transactions, isLoading, error, hasMore, loadMore } = useInfiniteTransactions({
    filters,
    userId,
    refreshKey,
  })

  const observerRef = useRef<HTMLDivElement>(null)

  // 무한 스크롤 IntersectionObserver
  useEffect(() => {
    // Radix ScrollArea 내부의 viewport 가져오기
    const scrollArea = document.querySelector("[data-radix-scroll-area-viewport]")
    if (!scrollArea) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore()
        }
      },
      {
        root: scrollArea,
        threshold: 0.1,
      }
    )

    const currentObserverRef = observerRef.current
    if (currentObserverRef) observer.observe(currentObserverRef)

    return () => {
      if (currentObserverRef) observer.unobserve(currentObserverRef)
    }
  }, [isLoading, hasMore, loadMore])

  // 렌더링 로직
  const renderContent = () => {
    if (isLoading && transactions.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center">
          <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
          <p className="font-semibold">오류가 발생했습니다</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )
    }
    if (transactions.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-center text-muted-foreground">표시할 데이터가 없습니다.</p>
        </div>
      )
    }
    return (
      <div>
        {/* 헤더 */}
        <div className="grid grid-cols-5 p-4 font-semibold items-center text-xs text-gray-500 border-b">
          <div>날짜</div>
          <div>카테고리</div>
          <div>세부내역</div>
          <div>채널</div>
          <div className="text-right">금액</div>
        </div>

        {/* 스크롤 영역 */}
        <ScrollArea className="h-[360px] w-full">
          <div className="space-y-0">
            {transactions.map((tx, index) => (
              <TransactionItem key={`${tx.timestamp}-${index}`} tx={tx} />
            ))}
            {/* 관찰 대상 (마지막) */}
            <div ref={observerRef} className="h-6" />
          </div>

          {/* 상태 표시 */}
          {isLoading && <div className="text-center py-4">로딩 중...</div>}
          {!hasMore && (
            <div className="text-center text-gray-400 py-4">모든 내역을 불러왔습니다.</div>
          )}
        </ScrollArea>
      </div>
    )
  }

  return (
    <Card>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}
