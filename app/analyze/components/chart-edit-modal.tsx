"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface ChartEditModalProps {
  widgetId: string
  onClose: () => void
  onSave: (config: any) => void
}

export default function ChartEditModal({ widgetId, onClose, onSave }: ChartEditModalProps) {
  const [config, setConfig] = useState({
    title: "차트 제목",
    xAxis: "month",
    yAxis: "amount",
    groupBy: "category",
    aggregation: "sum",
    showLegend: true,
    showGrid: true,
    colorScheme: "default",
  })

  const handleSave = () => {
    onSave(config)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>차트 편집</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">기본 설정</h3>

            <div>
              <Label htmlFor="title">차트 제목</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="xAxis">X축 필드</Label>
              <Select value={config.xAxis} onValueChange={(value) => setConfig({ ...config, xAxis: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">월</SelectItem>
                  <SelectItem value="category">카테고리</SelectItem>
                  <SelectItem value="date">날짜</SelectItem>
                  <SelectItem value="ageGroup">연령대</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="yAxis">Y축 필드</Label>
              <Select value={config.yAxis} onValueChange={(value) => setConfig({ ...config, yAxis: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">금액</SelectItem>
                  <SelectItem value="count">거래 건수</SelectItem>
                  <SelectItem value="balance">잔액</SelectItem>
                  <SelectItem value="percentage">비율</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="aggregation">집계 방식</Label>
              <Select
                value={config.aggregation}
                onValueChange={(value) => setConfig({ ...config, aggregation: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">합계</SelectItem>
                  <SelectItem value="avg">평균</SelectItem>
                  <SelectItem value="max">최대값</SelectItem>
                  <SelectItem value="min">최소값</SelectItem>
                  <SelectItem value="count">개수</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">고급 설정</h3>

            <div>
              <Label htmlFor="groupBy">그룹화 기준</Label>
              <Select value={config.groupBy} onValueChange={(value) => setConfig({ ...config, groupBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">카테고리</SelectItem>
                  <SelectItem value="transactionType">거래 유형</SelectItem>
                  <SelectItem value="ageGroup">연령대</SelectItem>
                  <SelectItem value="occupation">직업군</SelectItem>
                  <SelectItem value="spendingType">소비 성향</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="colorScheme">색상 테마</Label>
              <Select
                value={config.colorScheme}
                onValueChange={(value) => setConfig({ ...config, colorScheme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">기본</SelectItem>
                  <SelectItem value="blue">블루</SelectItem>
                  <SelectItem value="green">그린</SelectItem>
                  <SelectItem value="purple">퍼플</SelectItem>
                  <SelectItem value="orange">오렌지</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showLegend"
                  checked={config.showLegend}
                  onCheckedChange={(checked) => setConfig({ ...config, showLegend: !!checked })}
                />
                <Label htmlFor="showLegend">범례 표시</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showGrid"
                  checked={config.showGrid}
                  onCheckedChange={(checked) => setConfig({ ...config, showGrid: !!checked })}
                />
                <Label htmlFor="showGrid">격자 표시</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
