"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"            // ✅ 추가
import { Filter, RotateCcw } from "lucide-react"           // ✅ 아이콘(선택)
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

interface FilterPanelProps {
  filters: any
  onFiltersChange: (filters: any) => void
  hideTransactionFilter?: boolean
}

export default function FilterPanel({ filters, onFiltersChange, hideTransactionFilter = false }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const searchParams = useSearchParams()

  const limit = useMemo(() => {
    const min = searchParams.get("durationStart") ?? ""
    const max = searchParams.get("durationEnd") ?? ""
    return { min, max }
  }, [searchParams])

  const clamp = (v: string, min: string, max: string) => {
    if (!v) return v
    if (min && v < min) return min
    if (max && v > max) return max
    return v
  }

  const handleStartChange = (val: string) => {
    const clamped = clamp(val, limit.min, limit.max)
    const end = filters.dateRange.end || limit.max
    const startFinal = end && clamped > end ? end : clamped
    onFiltersChange({ ...filters, dateRange: { ...filters.dateRange, start: startFinal } })
  }

  const handleEndChange = (val: string) => {
    const clamped = clamp(val, limit.min, limit.max)
    const start = filters.dateRange.start || limit.min
    const endFinal = start && clamped < start ? start : clamped
    onFiltersChange({ ...filters, dateRange: { ...filters.dateRange, end: endFinal } })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { start: limit.min || null, end: limit.max || null },
      transactionType: "DEPOSIT",
    })
  }

  return (
    <Card className="mx-6 mt-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Label className="font-medium">필터</Label>
          </div>

          {/* 기간 + 초기화 버튼 묶음 */}
          <div className="flex items-center gap-2 flex-wrap">
            <Label className="text-sm">기간:</Label>

            <Input
              type="date"
              value={filters.dateRange.start ?? ""}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-36"
              min={limit.min || undefined}
              max={
                (filters.dateRange.end && limit.max
                  ? (filters.dateRange.end < limit.max ? filters.dateRange.end : limit.max)
                  : limit.max) || undefined
              }
            />

            <span className="text-sm text-muted-foreground">~</span>

            <Input
              type="date"
              value={filters.dateRange.end ?? ""}
              onChange={(e) => handleEndChange(e.target.value)}
              className="w-36"
              min={
                (filters.dateRange.start && limit.min
                  ? (filters.dateRange.start > limit.min ? filters.dateRange.start : limit.min)
                  : limit.min) || undefined
              }
              max={limit.max || undefined}
            />



            {!hideTransactionFilter && (
              <div className="flex items-center gap-2">
                <Label className="text-sm">거래 유형:</Label>
                <Select
                  value={filters.transactionType}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, transactionType: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEPOSIT">수입</SelectItem>
                    <SelectItem value="WITHDRAW">지출</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-2 whitespace-nowrap"
              onClick={clearAllFilters}
              title="전체 초기화"
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              전체 초기화
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
