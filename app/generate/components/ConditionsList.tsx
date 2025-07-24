import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import type { BackendOptionItem } from '../types';

interface ConditionsListProps {
  conditions: BackendOptionItem[];
  onDelete: (id: number) => void;
  getDisplayValue: (key: string, value: string | number) => string;
  getLabelForKey: (key: string) => string;
}

const ConditionsList: React.FC<ConditionsListProps> = ({ 
  conditions, onDelete, getDisplayValue, getLabelForKey 
}) => {
  return (
    <Card className="mt-8">
      <CardHeader><CardTitle>추가된 조건 목록</CardTitle></CardHeader>
      <CardContent>
        {conditions.length === 0 ? <p className="text-sm text-gray-500">조건이 없습니다.</p> : (
          <div className="space-y-4">
            {conditions.map((conditionSet) => (
              <div key={conditionSet.id} className="relative flex flex-wrap items-center gap-2 p-3 bg-gray-100 rounded-md">
                {Object.entries(conditionSet).filter(([key]) => !['id', 'userCount'].includes(key)).map(([key, value]) => (
                  <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getLabelForKey(key)}: {getDisplayValue(key, value)}
                  </span>
                ))}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  사용자 수: {conditionSet.userCount}명
                </span>
                <Button variant="ghost" size="icon" onClick={() => onDelete(conditionSet.id)} className="ml-auto h-6 w-6 text-red-500 hover:text-red-700">
                   <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default React.memo(ConditionsList);