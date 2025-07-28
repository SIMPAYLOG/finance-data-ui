import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

import type { 
  AgeGroupOption, OccupationOption, PreferenceOption, 
  FrontendFormDataItem
} from '../types';

interface ConditionFormProps {
  formData: FrontendFormDataItem;
  onInputChange: (field: Exclude<keyof FrontendFormDataItem, 'durationStart' | 'durationEnd'>, value: string) => void;
  onAddCondition: () => void;
  isFormValid: boolean;
  isLoading: boolean;
  ageGroupOptions: AgeGroupOption[];
  occupationOptions: OccupationOption[];
  preferenceOptions: PreferenceOption[];
}

const ConditionForm: React.FC<ConditionFormProps> = ({
  formData,
  onInputChange,
  onAddCondition,
  isFormValid,
  isLoading,
  ageGroupOptions,
  occupationOptions,
  preferenceOptions
}) => {
  return (
    <Card>
      <CardHeader><CardTitle>조건 입력</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>나이대</Label>
            <Select value={formData.ageRange} onValueChange={(value) => onInputChange("ageRange", value)} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder={isLoading ? "..." : "선택"} /></SelectTrigger>
              <SelectContent>
                {ageGroupOptions.map((option) => (<SelectItem key={option.id} value={option.id}>{option.groupName}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>성별</Label>
            <Select value={formData.gender} onValueChange={(value) => onInputChange("gender", value)} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">남성</SelectItem>
                <SelectItem value="female">여성</SelectItem>
                <SelectItem value="mixed">혼합</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>직업군</Label>
            <Select value={formData.occupation} onValueChange={(value) => onInputChange("occupation", value)} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder={isLoading ? "..." : "선택"} /></SelectTrigger>
              <SelectContent>
                {occupationOptions.map((option) => (<SelectItem key={option.id} value={option.id}>{option.categoryName}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>소비 성향</Label>
            <Select value={formData.consumptionType} onValueChange={(value) => onInputChange("consumptionType", value)} disabled={isLoading}>
                <SelectTrigger><SelectValue placeholder={isLoading ? "..." : "선택"} /></SelectTrigger>
                <SelectContent>
                    {preferenceOptions.map((option) => (<SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>생성할 사용자 수</Label>
          <Input type="number" placeholder="예: 100" value={formData.userCount} onChange={(e) => onInputChange("userCount", e.target.value)} min="1" />
        </div>
        <div className="flex justify-end">
          <Button onClick={onAddCondition} disabled={!isFormValid}><PlusCircle className="mr-2 h-4 w-4" /> 조건 추가</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ConditionForm);