"use client"

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft, Download} from "lucide-react";

function SimulationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const durationStart = searchParams.get('durationStart');
    const durationEnd = searchParams.get('durationEnd');

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [progressMessages, setProgressMessages] = useState<string[]>([]);
    const [socketStatus, setSocketStatus] = useState<string>("대기 중");
    
    useEffect(() => {
        if (!durationStart || !durationEnd) {
            alert("기간 정보가 없습니다. 이전 페이지로 돌아갑니다.");
            router.replace('/generate');
            return;
        }

        const wsUrl = `ws://localhost:8080/start-simulation?durationStart=${durationStart}&durationEnd=${durationEnd}`;
        const newSocket = new WebSocket(wsUrl);
        
       setSocket(newSocket);
        setSocketStatus("연결 중...");
        
        newSocket.onopen = () => setSocketStatus("연결 성공");
        newSocket.onmessage = (event) => {
            setProgressMessages(prev => [...prev, event.data]);
        };
        
        newSocket.onclose = (event: CloseEvent) => {
            if (event.wasClean) {
                console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                setSocketStatus("연결 종료");
            } else {
                console.warn('Connection died');
                setSocketStatus("연결 끊김 (비정상)");
            }
        };
        
        newSocket.onerror = (error: Event) => {
            console.error("WebSocket error observed:", error);
        };

        return () => {
            newSocket.close();
        }
    }, [durationStart, durationEnd, router]);

    const isComplete = socketStatus === "연결 종료";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DataGen</h1>
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
                    <div className="p-4 bg-gray-100 rounded-lg h-64 overflow-y-auto space-y-2 font-mono text-sm">
                        <p>상태: <span className={isComplete ? "text-green-600" : "text-blue-600"}>{socketStatus}</span></p>
                        {progressMessages.map((msg, index) => (
                            <p key={index} className="text-gray-700">▶ {msg}</p>
                        ))}
                    </div>
                    
                    {isComplete && (
                         <div className="grid md:grid-cols-2 gap-4">
                            <Button className="w-full" onClick={() => alert('JSON 다운로드')}><Download className="mr-2 h-4 w-4" /> JSON 다운로드</Button>
                            <Button className="w-full" variant="outline" onClick={() => alert('CSV 다운로드')}><Download className="mr-2 h-4 w-4" /> CSV 다운로드</Button>
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