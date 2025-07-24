import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LABEL_COLOR_MAP } from '../constants';
import type { FrontendCalculatedGraphs } from '../types';

interface StatusGraphsProps {
  data: FrontendCalculatedGraphs;
  getLabelForKey: (key: string) => string;
}

const StatusGraphs: React.FC<StatusGraphsProps> = ({ data, getLabelForKey }) => {
  const { ageData, genderData, consumptionData, totalUserCount } = data;
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>입력 조건 미리보기</CardTitle>
        <CardDescription>총 사용자 수: {totalUserCount}명</CardDescription>
      </CardHeader>
      <CardContent>
        {totalUserCount === 0 ? <p className="text-center text-gray-500 py-10">조건을 추가하면 현황 그래프가 나타납니다.</p> : (
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-center mb-2">{getLabelForKey("ageGroup")}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ageData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                    {ageData.map((entry) => (<Cell key={`cell-age-${entry.name}`} fill={LABEL_COLOR_MAP[entry.name] || '#CCCCCC'} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}명 (${((value / totalUserCount) * 100).toFixed(1)}%)`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-center mb-2">{getLabelForKey("gender")}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                    {genderData.map((entry) => (<Cell key={`cell-gender-${entry.name}`} fill={LABEL_COLOR_MAP[entry.name] || '#CCCCCC'} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}명 (${((value / totalUserCount) * 100).toFixed(1)}%)`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-center mb-2">{getLabelForKey("preferenceId")}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={consumptionData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                    {consumptionData.map((entry) => (<Cell key={`cell-con-${entry.name}`} fill={LABEL_COLOR_MAP[entry.name] || '#CCCCCC'} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}명 (${((value / totalUserCount) * 100).toFixed(1)}%)`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default React.memo(StatusGraphs);