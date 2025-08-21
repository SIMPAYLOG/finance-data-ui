"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function DashboardSettings() {
  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="대시보드 설정"
        description="차트 레이아웃, 데이터 표시 옵션 및 개인화 설정을 관리합니다"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>대시보드 레이아웃</CardTitle>
            <CardDescription>위젯 배치와 크기를 조정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">자동 새로고침</Label>
              <Switch id="auto-refresh" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode">컴팩트 모드</Label>
              <Switch id="compact-mode" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">새로고침 간격</Label>
              <Select defaultValue="5min">
                <SelectTrigger>
                  <SelectValue placeholder="간격 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1min">1분</SelectItem>
                  <SelectItem value="5min">5분</SelectItem>
                  <SelectItem value="15min">15분</SelectItem>
                  <SelectItem value="30min">30분</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>데이터 표시 설정</CardTitle>
            <CardDescription>차트에 표시할 데이터 범위와 형식을 설정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-period">기본 기간</Label>
              <Select defaultValue="6months">
                <SelectTrigger>
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1개월</SelectItem>
                  <SelectItem value="3months">3개월</SelectItem>
                  <SelectItem value="6months">6개월</SelectItem>
                  <SelectItem value="1year">1년</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency-format">통화 표시 형식</Label>
              <Select defaultValue="krw">
                <SelectTrigger>
                  <SelectValue placeholder="형식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="krw">₩ (원화)</SelectItem>
                  <SelectItem value="krw-short">₩ (천원 단위)</SelectItem>
                  <SelectItem value="krw-million">₩ (백만원 단위)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-percentages">비율 표시</Label>
              <Switch id="show-percentages" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>위젯 관리</CardTitle>
          <CardDescription>대시보드에 표시할 차트를 선택하고 순서를 조정합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "월별 수입/지출 비교", type: "bar", enabled: true },
              { name: "카테고리별 지출 비중", type: "pie", enabled: true },
              { name: "시간 흐름에 따른 잔액 변화", type: "line", enabled: true },
              { name: "상위 소비 카테고리 TOP 5", type: "horizontalBar", enabled: true },
              { name: "집단 사용자 평균 비교", type: "groupedBar", enabled: false },
            ].map((widget, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch id={`widget-${index}`} defaultChecked={widget.enabled} />
                  <div>
                    <p className="font-medium">{widget.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {widget.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  ⋮⋮
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>이상 패턴 감지 시 알림을 받을 조건을 설정합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="spending-alerts">지출 이상 알림</Label>
            <Switch id="spending-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="saving-alerts">저축률 알림</Label>
            <Switch id="saving-alerts" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spending-threshold">지출 임계값 (%)</Label>
            <Input id="spending-threshold" type="number" placeholder="20" className="w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
