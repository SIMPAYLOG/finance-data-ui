"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"

import { useGeneratePage } from './hooks/useGeneratePage';
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import DateSelector from "./components/DateSelector";
import ConditionForm from './components/ConditionForm';
import ConditionList from './components/ConditionsList';
import StatusGraphs from './components/StatusGraphs';
import { getDisplayValue, getLabelForKey } from './utils';

export default function GeneratePage() {
  const {
    currentStep, formData, handleDateChange,
    ageGroupOptions, occupationOptions, preferenceOptions,
    handleInputChange, handleAddCondition, isFormValid, handleDeleteCondition,
    savedConditions, isLoading, nextStep, isAnalyzing, frontendCalculatedGraphs
  } = useGeneratePage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">데이터 생성</h2>
            <span className="text-sm text-gray-500">
              Step {currentStep} of 2
            </span>
          </div>
          <Progress value={(currentStep / 2) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span
              className={currentStep >= 1 ? "text-blue-600 font-medium" : ""}
            >
              조건 입력
            </span>
            <span
              className={currentStep >= 2 ? "text-blue-600 font-medium" : ""}
            >
              분석 및 미리보기
            </span>
          </div>
        </div>

        {currentStep === 1 && (
          <>
          <StatusGraphs data={frontendCalculatedGraphs} getLabelForKey={getLabelForKey}/>
            <DateSelector
              formData={formData}
              handleDateChange={handleDateChange}
            />
            <ConditionForm
              formData={formData}
              onInputChange={handleInputChange}
              onAddCondition={handleAddCondition}
              isFormValid={isFormValid}
              isLoading={isLoading}
              ageGroupOptions={ageGroupOptions}
              occupationOptions={occupationOptions}
              preferenceOptions={preferenceOptions}
            />

            <ConditionList 
              conditions={savedConditions}
              onDelete={handleDeleteCondition}
              getDisplayValue={(key, value) => getDisplayValue(key, value, { ageGroupOptions, occupationOptions, preferenceOptions })}
              getLabelForKey={getLabelForKey}
            />

            <div className="flex justify-end mt-6">
                <Button onClick={nextStep} disabled={isAnalyzing || savedConditions.length === 0 || !formData.durationStart || !formData.durationEnd}>
                    {isAnalyzing ? "분석 중..." : "분석 및 미리보기"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
