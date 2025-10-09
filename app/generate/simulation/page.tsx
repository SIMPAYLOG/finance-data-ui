"use client"

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useValidatedWebSocket } from '@/hooks/use-validated-websocket';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft, Download } from "lucide-react";

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('sessionId');
  const durationStart = searchParams.get('durationStart');
  const durationEnd = searchParams.get('durationEnd');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { socketStatus, progressMessages } = useValidatedWebSocket(
    sessionId,
    durationStart,
    durationEnd
  );

  const isComplete = socketStatus === "연결 종료";

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [progressMessages]);

  // 다운로드 함수
  // const handleDownload = async (format: "JSON" | "CSV") => {
  //   if (!sessionId) return;
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/transactions/export?sessionId=${sessionId}&format=${format}`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("파일 다운로드 실패");
  //     }
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `transactions_${sessionId}.${format.toLowerCase()}`;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error(error);
  //     alert("다운로드 중 오류가 발생했습니다.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SIMPAYLOG</h1>
          </div>
          </Link>
          <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />홈으로</Button></Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>데이터 생성 진행률</CardTitle>
            <CardDescription>
              {isComplete ? "데이터 생성이 완료되었습니다. 아래에서 다운로드하세요." : "실시간으로 데이터 생성 과정을 확인합니다."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              ref={scrollContainerRef} 
              className="p-4 bg-gray-100 rounded-lg h-64 overflow-y-auto space-y-2 font-mono text-sm"
            >
              <p>상태: <span className={isComplete ? "text-green-600" : "text-blue-600"}>{socketStatus}</span></p>
              {progressMessages.map((msg, index) => (
                <p key={index} className="text-gray-700">▶ {msg}</p>
              ))}
            </div>

            {isComplete && (
              <div className="grid md:grid-cols-1 gap-4">
                {/* <Button className="w-full" onClick={() => handleDownload("JSON")}>
                  <Download className="mr-2 h-4 w-4" /> JSON 다운로드
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleDownload("CSV")}>
                  <Download className="mr-2 h-4 w-4" /> CSV 다운로드
                </Button> */}
                <Button className="w-full bg-black text-white font-bold hover:bg-gray-800" variant="secondary" onClick={() => {
                  router.push(`/analyze?durationStart=${durationStart}&durationEnd=${durationEnd}`);
                }}>
                  분석 페이지로 이동
                </Button>
              </div>
            )}

            <div className="flex justify-start">
              <Link href="/generate">
                <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> 다시 조건 설정하기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SimulationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-8">페이지를 불러오는 중...</div>}>
      <SimulationContent />
    </Suspense>
  )
}