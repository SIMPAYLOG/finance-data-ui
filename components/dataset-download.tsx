"use client"

import { useState } from "react"
import { useSessionStore } from "@/store/useSessionStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Download,
  Database,
  BarChart3,
  Shield,
  Settings,
  FileText,
  TrendingUp,
  Lock,
  Zap,
  CheckCircle,
  Eye,
  Filter,
} from "lucide-react"

const SCHEMAS = {
  raw: [
    "transactionId",
    "userId",
    "timestamp",
    "transactionType",
    "detailType",
    "category",
    "subcategory",
    "counterparty",
    "amount",
    "channel",
    "balanceBefore",
    "balanceAfter",
    "description",
    "memo"
  ],
  aggregated: [
    "userId",
    "period",
    "totalSpent",
    "avgTxn",
    "foodRatio",
    "transportRatio",
    "leisureRatio",
    "imcomeVsSepnding",
  ],
  masked: [ 
    "transactionId",
    "userId",
    "timestamp",
    "amount",
    "category",
    "channel",
  ],
};

const datasetOptions = [
  {
    id: "raw",
    title: "원본 데이터",
    subtitle: "Raw Events",
    description: "개별 거래 로그 형태의 상세한 원본 데이터",
    icon: Database,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    format: "개별 거래 로그 (Raw Events)",
    purpose: "세밀한 분석, 파이프라인 성능 테스트",
    effect: "실제 금융 로그처럼 보이는 데이터 제공",
    columns: [
      { name: "transaction_id", type: "string", description: "거래 고유 식별자" },
      { name: "user_id", type: "string", description: "사용자 ID" },
      { name: "timestamp", type: "datetime", description: "거래 시간" },
      { name: "amount", type: "number", description: "거래 금액" },
      { name: "transaction_type", type: "string", description: "거래 유형" },
      { name: "detail_type", type: "string", description: "거래 유형 상세 정보" },
      { name: "category", type: "string", description: "거래 종류 대분류" },
      { name: "sub_category", type: "string", description: "거래 종류 소분류" },
      { name: "counterparty", type: "string", description: "가맹점명" },
      { name: "channel", type: "string", description: "거래 채널" },
      { name: "balance_before", type: "number", description: "거래 전 잔액" },
      { name: "balance_after", type: "number", description: "거래 후 잔액" },
      { name: "description", type: "string", description: "결제 정보" },
      { name: "memo", type: "string", description: "사용자 메모" },
    ],
    sampleData: [
      {
        transaction_id: "TX20250901A",
        user_id: "U100",
        timestamp: "2025-09-01 08:30:00",
        transaction_type: "PAYMENT",
        amount: "5,200",
        balance_before: "1,200,000",
        balance_after: "1,194,800",
        category: "FOOD/CAFE",
        counterparty: "강남그린카페",
        channel: "POS",
      },
      {
        transaction_id: "TX20250901B",
        user_id: "U100",
        timestamp: "2025-09-01 12:10:00",
        transaction_type: "PAYMENT",
        amount: "1,350",
        balance_before: "1,194,800",
        balance_after: "1,193,450",
        category: "TRANSPORT",
        counterparty: "서울버스123",
        channel: "MOBILE",
      },
      {
        transaction_id: "TX20250901C",
        user_id: "U101",
        timestamp: "2025-09-01 14:25:00",
        transaction_type: "DEPOSIT",
        amount: "2,500,000",
        balance_before: "850,000",
        balance_after: "3,350,000",
        category: "SALARY",
        counterparty: "ABC회사",
        channel: "BANK",
      },
    ],
  },
  {
    id: "aggregated",
    title: "집계 데이터",
    subtitle: "Aggregates",
    description: "사용자/기간 단위로 집계된 통계 데이터",
    icon: BarChart3,
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    format: "사용자/기간 단위 집계 (Aggregates)",
    purpose: "지표 확인, 정책/연구용 시뮬레이션",
    effect: "소득·연령·성향별 소비 구조 비교 용이",
    columns: [
      { name: "user_id", type: "string", description: "사용자 ID" },
      { name: "period", type: "string", description: "집계 기간" },
      { name: "total_spent", type: "number", description: "총 지출액" },
      { name: "avg_transaction", type: "number", description: "평균 거래액" },
      { name: "category_ratios", type: "object", description: "카테고리별 비율" },
      { name: "income_vs_spending", type: "number", description: "소득 대비 지출 비율" },
    ],
    sampleData: [
      {
        user_id: "U100",
        period: "2025-09",
        total_spent: "2,481,894",
        avg_txn: "26,335",
        top3_categories: "LODGING, TRANSPORT, MEDICAL",
        food_ratio: "0.27",
        transport_ratio: "0.11",
        leisure_ratio: "0.17",
        income_vs_spending: "0.67",
      },
      {
        user_id: "U101",
        period: "2025-09",
        total_spent: "1,701,883",
        avg_txn: "53,273",
        top3_categories: "UTILITY, LODGING, TRANSPORT",
        food_ratio: "0.34",
        transport_ratio: "0.14",
        leisure_ratio: "0.11",
        income_vs_spending: "0.39",
      },
    ],
  },
  {
    id: "masked",
    title: "마스킹 데이터",
    subtitle: "Masked Raw",
    description: "민감 필드가 부분적으로 마스킹된 보안 강화 데이터",
    icon: Shield,
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    format: "민감 필드 부분 마스킹 (Masked Raw)",
    purpose: "보안·현실감 강화, 공개 공유",
    effect: '"실제처럼 안전하게 다룬다"는 메시지 제공',
    columns: [
      { name: "transaction_id", type: "string", description: "거래 ID (마스킹)" },
      { name: "user_id", type: "string", description: "사용자 ID (마스킹)" },
      { name: "timestamp", type: "datetime", description: "거래 시간" },
      { name: "amount", type: "number", description: "거래 금액" },
      { name: "category", type: "string", description: "카테고리" },
      { name: "channel", type: "string", description: "거래 채널" },
    ],
    sampleData: [
      {
        transaction_id: "TX***901A",
        user_id: "U***",
        timestamp: "2025-09-01 08:30:00",
        transaction_type: "PAYMENT",
        amount: "5,200",
        category: "FOOD/CAFE",
        channel: "POS",
      },
      {
        transaction_id: "TX***901B",
        user_id: "U***",
        timestamp: "2025-09-01 12:10:00",
        transaction_type: "PAYMENT",
        amount: "1,350",
        category: "TRANSPORT",
        channel: "MOBILE",
      },
    ],
  },
]

interface DatasetDownloadProps {
  filters: any
}

export function DatasetDownload({filters }: DatasetDownloadProps) {
  const [selectedDataset, setSelectedDataset] = useState("raw")
  const [downloadFormat, setDownloadFormat] = useState("csv")
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [customPreset, setCustomPreset] = useState("researcher")
  const sessionId = useSessionStore((state) => state.sessionId)

  const currentDataset = datasetOptions.find((d) => d.id === selectedDataset)

  const toggleColumn = (columnName: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnName) ? prev.filter((col) => col !== columnName) : [...prev, columnName],
    )
  }

  const selectPreset = (preset: string) => {
    setCustomPreset(preset)
    const presets = {
      researcher: ["timestamp", "amount", "category"],
      business: ["user_id", "channel", "amount"],
      marketing: ["category", "sub_category", "amount", "timestamp"],
      policy: ["period", "total_spent", "income_vs_spending"],
      fintech: ["transaction_type", "channel", "amount", "balance_after"],
    }
    setSelectedColumns(presets[preset as keyof typeof presets] || [])
  }

  function snakeToCamel(s: string) {
    return s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  } 

  const handleDownload = async (format: "JSON" | "CSV") => {
    if (!sessionId) return;

    // 탭 상태에 따라 구분
    const isAggregated = selectedDataset === "aggregated";
    const isMasked = selectedDataset === "masked";

    
    let columns;
    if (selectedDataset === "custom") {
      columns = selectedColumns.map(snakeToCamel);
    } else {
      columns = SCHEMAS[selectedDataset as keyof typeof SCHEMAS];
    }
    
    const requestBody = {
      sessionId: sessionId,
      format,
      columns,
      isAggregated,
      isMasked,
      durationStart: "2025-10-02",
      durationEnd: "2025-10-09",
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/export?sessionId=${sessionId}&format=${format}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );
      if (!response.ok) throw new Error("파일 다운로드 실패");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions_${selectedDataset}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };


  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <DashboardHeader
        title="금융 데이터셋 다운로드"
        description="다양한 형태의 금융 거래 데이터를 연구 및 분석 목적으로 활용하세요"
      />

      <Tabs value={selectedDataset} onValueChange={setSelectedDataset} className="space-y-6">
        {/* 탭 네비게이션 */}
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {datasetOptions.map((dataset) => (
            <TabsTrigger
              key={dataset.id}
              value={dataset.id}
              className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white"
            >
              <dataset.icon className={`h-5 w-5 ${dataset.iconColor}`} />
              <div className="text-center">
                <div className="font-medium">{dataset.title}</div>
                <div className="text-xs text-muted-foreground">{dataset.subtitle}</div>
              </div>
            </TabsTrigger>
          ))}
          <TabsTrigger value="custom" className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white">
            <Settings className="h-5 w-5 text-orange-600" />
            <div className="text-center">
              <div className="font-medium">컬럼 선택</div>
              <div className="text-xs text-muted-foreground">Custom Export</div>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* 각 데이터셋 탭 내용 */}
        {datasetOptions.map((dataset) => (
          <TabsContent key={dataset.id} value={dataset.id} className="space-y-6">
            <Card className={dataset.color}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white">
                    <dataset.icon className={`h-8 w-8 ${dataset.iconColor}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{dataset.title}</CardTitle>
                    <CardDescription className="text-base">{dataset.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 데이터셋 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">제공 형태</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{dataset.format}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium">활용 목적</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{dataset.purpose}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">기대 효과</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{dataset.effect}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 컬럼 정보 */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      데이터 스키마
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dataset.columns.map((column, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{column.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {column.type}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">{column.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 샘플 데이터 */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      샘플 데이터 미리보기
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(dataset.sampleData[0]).map((key) => (
                              <TableHead key={key} className="text-xs font-medium">
                                {key}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dataset.sampleData.map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value, cellIndex) => (
                                <TableCell key={cellIndex} className="text-xs">
                                  {value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        📊 실제 데이터셋:{" "}
                        <strong>{Math.floor(Math.random() * 50000 + 10000).toLocaleString()}건</strong> | 예상 크기:{" "}
                        <strong>~{Math.floor(Math.random() * 20 + 5)}MB</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {/* 컬럼 선택 탭 */}
        <TabsContent value="custom" className="space-y-6">
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-white">
                  <Settings className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">컬럼 선택 다운로드</CardTitle>
                  <CardDescription className="text-base">
                    필요한 컬럼만 선택하여 맞춤형 데이터를 추출하세요
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 프리셋 선택 */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    빠른 프리셋 선택
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "researcher", name: "연구자용", desc: "시간, 금액, 카테고리", icon: "🔬" },
                      { id: "business", name: "기업용", desc: "사용자, 채널, 위치, 금액", icon: "🏢" },
                      { id: "marketing", name: "마케팅용", desc: "카테고리, 가맹점, 금액", icon: "📈" },
                      // { id: "policy", name: "정책연구용", desc: "기간, 총지출, 소득비율", icon: "🏛️" },
                      { id: "fintech", name: "핀테크용", desc: "거래유형, 채널, 잔액", icon: "💳" },
                    ].map((preset) => (
                      <Button
                        key={preset.id}
                        variant={customPreset === preset.id ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-start gap-2"
                        onClick={() => selectPreset(preset.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{preset.icon}</span>
                          <span className="font-medium">{preset.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground text-left">{preset.desc}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 컬럼 선택 */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    컬럼 선택 ({selectedColumns.length}개 선택됨)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 모든 데이터셋의 컬럼을 합쳐서 표시 */}
                    {[...datasetOptions[0].columns, ...datasetOptions[2].columns]
                      .filter((col, index, self) => self.findIndex((c) => c.name === col.name) === index)
                      .map((column) => (
                        <div
                          key={column.name}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedColumns.includes(column.name)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleColumn(column.name)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox checked={selectedColumns.includes(column.name)} /*readOnly*/ />
                            <div>
                              <span className="font-medium">{column.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {column.type}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{column.description}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* 선택된 컬럼 미리보기 */}
              {selectedColumns.length > 0 && (
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      선택된 컬럼 미리보기
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedColumns.map((col) => (
                        <Badge key={col} variant="secondary" className="bg-blue-100 text-blue-800">
                          {col}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => toggleColumn(col)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✅ {selectedColumns.length}개 컬럼이 선택되었습니다. 예상 파일 크기:{" "}
                        <strong>~{Math.floor(selectedColumns.length * 2.5)}MB</strong>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 다운로드 버튼 */}
      <div className="flex justify-center py-6">
        <Button
          onClick={() => handleDownload("CSV")} // ✅ 이렇게 화살표 함수로 감싸야 함
          size="lg"
          className="text-lg px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            데이터 다운로드
          <Download className="h-6 w-6 mr-3" />📥 
          <Badge variant="secondary" className="ml-3 bg-white text-blue-600">
            {selectedDataset === "custom" ? `${selectedColumns.length}개 컬럼` : currentDataset?.title || "데이터셋"}
          </Badge>
        </Button>
      </div>

      {/* 이용 약관 */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">데이터 이용 약관</p>
              <ul className="space-y-1 text-xs">
                <li>• 본 데이터는 연구 및 분석 목적으로만 사용 가능합니다</li>
                <li>• 개인정보는 모두 익명화 처리되었습니다</li>
                <li>• 상업적 재배포는 금지되며, 출처 명시가 필요합니다</li>
                <li>• 데이터 사용 시 발생하는 모든 책임은 사용자에게 있습니다</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
