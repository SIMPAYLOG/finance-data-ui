"use client";

import { Progress } from "@/components/ui/progress"

import { useGeneratePage } from './hooks/useGeneratePage';
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import DateSelector from "./components/DateSelector";

export default function GeneratePage() {
  const {
    currentStep, formData, handleDateChange
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
            <DateSelector
              formData={formData}
              handleDateChange={handleDateChange}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
