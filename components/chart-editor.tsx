"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Settings,
  Palette,
  Filter,
  Save,
  RotateCcw,
  Eye,
} from "lucide-react"

interface ChartConfig {
  type: string
  xAxis: string
  yAxis: string
  aggregation: string
  groupBy: string
  filters: any[]
  title?: string
  description?: string
  colors?: string[]
}

interface ChartEditorProps {
  isOpen: boolean
  onClose: () => void
  config: ChartConfig
  onConfigChange: (config: ChartConfig) => void
  title: string
}

export function ChartEditor({ isOpen, onClose, config, onConfigChange, title }: ChartEditorProps) {
  const [localConfig, setLocalConfig] = useState<ChartConfig>(config)
  const [previewData, setPreviewData] = useState<any[]>([])

  // 사용 가능한 필드들 (실제로는 API에서 가져올 것)
  const availableFields = [
    { value: "month", label: "월", type: "date" },
    { value: "category", label: "카테고리", type: "string" },
    { value: "amount", label: "금액", type: "number" },
    { value: "income", label: "수입", type: "number" },
    { value: "expense", label: "지출", type: "number" },
    { value: "balance", label: "잔액", type: "number" },
    { value: "userId", label: "사용자 ID", type: "string" },
    { value: "ageGroup", label: "연령대", type: "string" },
    { value: "occupation", label: "직업", type: "string" },
    { value: "spendingType", label: "소비 성향", type: "string" },
  ]

  const chartTypes = [
    { value: "bar", label: "막대 차트", icon: BarChart3 },
    { value: "line", label: "선 차트", icon: LineChart },
    { value: "pie", label: "원형 차트", icon: PieChart },
    { value: "horizontalBar", label: "가로 막대", icon: TrendingUp },
    { value: "area", label: "영역 차트", icon: TrendingUp },
  ]

  const aggregationTypes = [
    { value: "sum", label: "합계" },
    { value: "avg", label: "평균" },
    { value: "count", label: "개수" },
    { value: "max", label: "최대값" },
    { value: "min", label: "최소값" },
  ]

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...localConfig, [key]: value }
    setLocalConfig(newConfig)
    generatePreviewData(newConfig)
  }

  const generatePreviewData = (config: ChartConfig) => {
    // 실제로는 API 호출로 데이터를 가져올 것
    // 여기서는 더미 데이터 생성
    const dummyData = [
      { month: "1월", amount: 1200000, category: "식비", income: 2500000, expense: 1800000 },
      { month: "2월", amount: 1100000, category: "교통비", income: 2400000, expense: 1900000 },
      { month: "3월", amount: 1300000, category: "쇼핑", income: 2600000, expense: 2100000 },
      { month: "4월", amount: 1000000, category: "문화생활", income: 2300000, expense: 1700000 },
      { month: "5월", amount: 1400000, category: "의료비", income: 2700000, expense: 1950000 },
    ]
    setPreviewData(dummyData)
  }

  const handleSave = () => {
    onConfigChange(localConfig)
    onClose()
  }

  const handleReset = () => {
    setLocalConfig(config)
    generatePreviewData(config)
  }

  useEffect(() => {
    generatePreviewData(localConfig)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            차트 편집: {title}
          </DialogTitle>
          <DialogDescription>차트의 데이터 소스, 축, 집계 방식 등을 자유롭게 설정하세요.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* 설정 패널 */}
          <div className="w-1/2 overflow-auto">
            <Tabs defaultValue="data" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="data">데이터</TabsTrigger>
                <TabsTrigger value="style">스타일</TabsTrigger>
                <TabsTrigger value="filter">필터</TabsTrigger>
                <TabsTrigger value="advanced">고급</TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">차트 유형</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {chartTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant={localConfig.type === type.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => updateConfig("type", type.value)}
                        >
                          <type.icon className="h-4 w-4 mr-2" />
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">축 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="x-axis">X축 (가로축)</Label>
                      <Select value={localConfig.xAxis} onValueChange={(value) => updateConfig("xAxis", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="X축 필드 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFields.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {field.type}
                                </Badge>
                                {field.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="y-axis">Y축 (세로축)</Label>
                      <Select value={localConfig.yAxis} onValueChange={(value) => updateConfig("yAxis", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Y축 필드 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFields
                            .filter((f) => f.type === "number")
                            .map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {field.type}
                                  </Badge>
                                  {field.label}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aggregation">집계 방식</Label>
                      <Select
                        value={localConfig.aggregation}
                        onValueChange={(value) => updateConfig("aggregation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="집계 방식 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {aggregationTypes.map((agg) => (
                            <SelectItem key={agg.value} value={agg.value}>
                              {agg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="group-by">그룹화 (선택사항)</Label>
                      <Select value={localConfig.groupBy} onValueChange={(value) => updateConfig("groupBy", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="그룹화 필드 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">그룹화 없음</SelectItem>
                          {availableFields
                            .filter((f) => f.type === "string")
                            .map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      색상 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-6 gap-2">
                      {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"].map(
                        (color, index) => (
                          <Button
                            key={color}
                            className="h-8 w-8 p-0 rounded-full"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              const newColors = [...(localConfig.colors || [])]
                              newColors[0] = color
                              updateConfig("colors", newColors)
                            }}
                          />
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">제목 및 설명</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chart-title">차트 제목</Label>
                      <Input
                        id="chart-title"
                        value={localConfig.title || title}
                        onChange={(e) => updateConfig("title", e.target.value)}
                        placeholder="차트 제목을 입력하세요"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chart-description">차트 설명</Label>
                      <Textarea
                        id="chart-description"
                        value={localConfig.description || ""}
                        onChange={(e) => updateConfig("description", e.target.value)}
                        placeholder="차트에 대한 설명을 입력하세요"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="filter" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      데이터 필터
                    </CardTitle>
                    <CardDescription>차트에 표시할 데이터를 필터링합니다</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>날짜 범위 제한</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>특정 카테고리만 표시</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>최소 금액 필터</Label>
                        <Switch />
                      </div>
                    </div>
                    <Separator />
                    <Button variant="outline" className="w-full bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      필터 조건 추가
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">고급 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>애니메이션 효과</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>데이터 레이블 표시</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>범례 표시</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>격자 표시</Label>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>차트 높이 (px)</Label>
                      <Input type="number" defaultValue="300" min="200" max="800" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* 미리보기 패널 */}
          <div className="w-1/2 border-l pl-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <h3 className="font-semibold">실시간 미리보기</h3>
                <Badge variant="secondary">{chartTypes.find((t) => t.value === localConfig.type)?.label}</Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{localConfig.title || title}</CardTitle>
                  {localConfig.description && <CardDescription>{localConfig.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">📊</div>
                      <p className="text-sm text-muted-foreground">{localConfig.type} 차트 미리보기</p>
                      <p className="text-xs text-muted-foreground">
                        X: {availableFields.find((f) => f.value === localConfig.xAxis)?.label} | Y:{" "}
                        {availableFields.find((f) => f.value === localConfig.yAxis)?.label} ({localConfig.aggregation})
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">설정 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">차트 유형:</span>
                    <span>{chartTypes.find((t) => t.value === localConfig.type)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">X축:</span>
                    <span>{availableFields.find((f) => f.value === localConfig.xAxis)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Y축:</span>
                    <span>{availableFields.find((f) => f.value === localConfig.yAxis)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">집계:</span>
                    <span>{aggregationTypes.find((a) => a.value === localConfig.aggregation)?.label}</span>
                  </div>
                  {localConfig.groupBy && localConfig.groupBy !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">그룹화:</span>
                      <span>{availableFields.find((f) => f.value === localConfig.groupBy)?.label}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
