import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, BarChart3, Download, Zap } from "lucide-react"

import {Footer} from "@/components/layout/footer"
import {Header} from "@/components/layout/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Header />
    {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">스마트한 소비 데이터 생성 서비스</h2>
          <p className="text-xl text-gray-600 mb-8">
            조건 기반으로 현실적인 소비 데이터를 생성하고, 다양한 분석 도구로 인사이트를 발견하세요
          </p>
          <Link href="/generate">
            <Button size="lg" className="text-lg px-8 py-4">
              <Zap className="mr-2 h-5 w-5" />
              시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">주요 기능</h3>
          <p className="text-gray-600">강력하고 직관적인 도구로 데이터를 생성하고 분석하세요</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>조건 기반 데이터 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                나이대, 성별, 소득 분위, 직업군, 소비 성향 등 다양한 조건을 설정하여 현실적인 소비 데이터를 생성합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>다양한 소비 성향 반영</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                절약형, 중립형, 소비형 등 다양한 소비 패턴을 반영하여 실제와 유사한 데이터를 생성합니다.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>다운로드 및 시각화</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                생성된 데이터를 JSON/CSV 형태로 다운로드하고, 다양한 차트로 시각화하여 분석할 수 있습니다.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">데모 미리보기</h3>
            <p className="text-gray-600">실제 생성되는 데이터의 예시를 확인해보세요</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">날짜</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">카테고리</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">세부내역</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">채널</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { date: "2025-07-24", category: "식료품 및 비주류 음료", detail: "부평 이슬상점", channel: "CARD", amount: "-17,500원" },
                  { date: "2025-07-24", category: "교통", detail: "인천교통공사", channel: "CARD", amount: "-2,900원" },
                  { date: "2025-07-25", category: "의류 및 신발", detail: "행복샵", channel: "CARD", amount: "-27,900원" },
                  { date: "2025-07-25", category: "", detail: "급여", channel: "TRANSFER", amount: "+2,920,000원" },
                  { date: "2025-07-26", category: "주류 및 담배", detail: "모아주류", channel: "CARD", amount: "-47,000원" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4 text-gray-700">{row.date}</td>
                    <td className="py-3 px-4 text-gray-700">{row.category || <span className="text-gray-400">—</span>}</td>
                    <td className="py-3 px-4 text-gray-700">{row.detail}</td>
                    <td className="py-3 px-4 text-gray-700">{row.channel}</td>
                    <td className={`py-3 px-4 text-right font-medium ${row.amount.startsWith("-") ? "text-red-500" : "text-blue-600"}`}>
                      {row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 rounded-2xl text-white p-12">
          <h3 className="text-3xl font-bold mb-4">지금 시작해보세요</h3>
          <p className="text-xl mb-8 opacity-90">몇 분 안에 원하는 조건의 소비 데이터를 생성하고 분석할 수 있습니다</p>
          <Link href="/generate">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              시작하기
            </Button>
          </Link>
        </div>
      </section>
    <Footer />
    </div>
  );
}