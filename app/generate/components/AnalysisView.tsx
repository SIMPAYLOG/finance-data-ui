import React, { useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { SampleUser } from '../types';
import { LABEL_COLOR_MAP } from '../constants';

interface AnalysisViewProps {
  analysisGraphs: {
    ageData: { name: string; value: number; }[];
    occupationData: { name: string; value: number; }[];
    genderData: { name: string; value: number; }[];
    totalUserCount: number;
  } | null;
  getLabelForKey: (key: string) => string;
  userSamples: SampleUser[];
  isFetchingSamples: boolean;
  hasMore: boolean;
  getDisplayValue: (key: string, value: string | number) => string;
  prevStep: () => void;
  generateData: () => void;
  fetchUserSamples: (pageNum: number) => Promise<void>;
  page: number;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysisGraphs, getLabelForKey, userSamples, isFetchingSamples, hasMore,
  getDisplayValue, prevStep, generateData, fetchUserSamples, page
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const lastSampleElementRef = useCallback((node: HTMLTableRowElement | null) => {
      if (isFetchingSamples) return;
      if (observer.current) observer.current.disconnect();
      const options = { root: scrollContainerRef.current, threshold: 0.9 };
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchUserSamples(page);
        }
      }, options);
      if (node) observer.current.observe(node);
    }, [isFetchingSamples, hasMore, page, fetchUserSamples]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>분석 결과</CardTitle>
          <CardDescription>서버에서 분석한 실제 데이터 분포입니다. (총 {analysisGraphs?.totalUserCount || 0}명)</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisGraphs ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(analysisGraphs).filter(([key]) => key.endsWith('Data')).map(([key, data]) => (
                  <div key={key}>
                      <h3 className="text-lg font-semibold text-center mb-2">{getLabelForKey(key.replace('Data','Distribution'))}</h3>
                      <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                          <Pie data={data as any} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value" >
                              {(data as any).map((entry: any) => (<Cell key={`cell-${entry.name}`} fill={LABEL_COLOR_MAP[entry.name] || '#CCCCCC'} />))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}명 (${((value / (analysisGraphs.totalUserCount || 1)) * 100).toFixed(1)}%)`}/>
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              ))}
            </div>
          ) : <p className="text-center text-gray-500 py-10">분석 데이터가 없습니다.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>샘플 데이터 미리보기</CardTitle>
          <CardDescription>생성된 사용자 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={scrollContainerRef} className="h-[300px] overflow-y-auto border rounded-lg relative">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0"><tr><th className="p-3 font-medium">이름</th><th className="p-3 font-medium">성별</th><th className="p-3 font-medium">나이</th><th className="p-3 font-medium">소비성향</th><th className="p-3 font-medium">직업</th></tr></thead>
              <tbody>
                {userSamples.map((user, index) => (
                  <tr key={index} ref={userSamples.length === index + 1 ? lastSampleElementRef : null} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.gender === 'M' ? '남' : '여'}</td>
                    <td className="p-3">{user.age}</td>
                    <td className="p-3">{getDisplayValue('preferenceId', user.preferenceId)}</td>
                    <td className="p-3">{user.occupationName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isFetchingSamples && <p className="text-center p-4">데이터를 불러오는 중...</p>}
            {!hasMore && userSamples.length > 0 && <p className="text-center p-4 text-gray-500">모든 데이터를 불러왔습니다.</p>}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> 이전 단계</Button>
          <Button onClick={generateData}>시뮬레이션 시작 <ArrowRight className="ml-2 h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default React.memo(AnalysisView);