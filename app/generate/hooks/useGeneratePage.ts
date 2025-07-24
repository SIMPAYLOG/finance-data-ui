import { useState, useEffect } from "react";

import type {
  FrontendFormDataItem, AgeGroupOption, OccupationOption, PreferenceOption,
  BackendOptionItem, BackendPayload
} from '../types';

const initialFormData: FrontendFormDataItem = {
  ageRange: "", gender: "", occupation: "", consumptionType: "",
  userCount: "", durationStart: undefined, durationEnd: undefined,
};
export function useGeneratePage() {
  const [formData, setFormData] = useState<FrontendFormDataItem>(initialFormData);  

    const handleDateChange = (field: 'durationStart' | 'durationEnd', date: Date | undefined) => {
        setFormData((prev) => {
            const newState = {
                ...prev,
                [field]: date,
            };

            if (field === 'durationStart' && !date) {
                newState.durationEnd = undefined;
            }

            return newState;
        });
    };

    const [ageGroupOptions, setAgeGroupOptions] = useState<AgeGroupOption[]>([]);
    const [occupationOptions, setOccupationOptions] = useState<OccupationOption[]>([]);
    const [preferenceOptions, setPreferenceOptions] = useState<PreferenceOption[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllInitialData = async () => {
          try {
            const [ageResponse, occupationResponse, preferenceResponse] = await Promise.all([
              fetch('http://localhost:8080/api/users/age-group'),
              fetch('http://localhost:8080/api/users/occupation-category'),
              fetch('http://localhost:8080/api/users/preference-list')
            ]);
            if (!ageResponse.ok || !occupationResponse.ok || !preferenceResponse.ok) throw new Error('초기 데이터 로딩 실패');
            
            const ageData = await ageResponse.json();
            const occupationData = await occupationResponse.json();
            const preferenceData = await preferenceResponse.json();

            if (ageData.status.code === 'SUCCESS') setAgeGroupOptions(ageData.result.ageGroup);
            if (occupationData.status.code === 'SUCCESS') setOccupationOptions(occupationData.result.occupationsCategories);
            if (preferenceData.status.code === 'SUCCESS') setPreferenceOptions(preferenceData.result.preferences);
          } catch (error) {
            console.error("Failed to fetch initial data:", error);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
          } finally {
            setIsLoading(false);
          }
        };
        fetchAllInitialData();
    }, []);
    
    const handleInputChange = (field: keyof FrontendFormDataItem, value: string) => {
        if (field === "userCount" && parseInt(value, 10) > 10000) {
            alert("생성할 사용자 수는 10,000명 이하로 입력해주세요.");
            value = "10000";
        }
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    
  const [savedConditions, setSavedConditions] = useState<BackendOptionItem[]>([]);

    const handleAddCondition = () => {
        const userCountNum = parseInt(formData.userCount, 10);
        if (!formData.ageRange || !formData.occupation || !formData.consumptionType || !formData.gender || isNaN(userCountNum) || userCountNum <= 0) {
            alert('모든 필드를 선택하고 유효한 사용자 수(1 이상)를 입력해주세요.');
            return;
        }
        const newId = savedConditions.length > 0 ? Math.max(...savedConditions.map(item => item.id)) + 1 : 1;
        const backendGender = formData.gender === 'male' ? 'MALE' : formData.gender === 'female' ? 'FEMALE' : 'MIX';
        
        const newBackendOption: BackendOptionItem = {
            id: newId,
            ageGroup: formData.ageRange,
            gender: backendGender,
            occupationCode: formData.occupation,
            preferenceId: formData.consumptionType,
            userCount: userCountNum,
        };
        setSavedConditions((prev) => [...prev, newBackendOption]);
    };

    const handleDeleteCondition = (idToDelete: number) => {
        setSavedConditions((prev) => prev.filter((item) => item.id !== idToDelete));
    };

    const isFormValid = !!formData.ageRange && !!formData.occupation && !!formData.consumptionType && !!formData.gender && parseInt(formData.userCount, 10) > 0;

    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const nextStep = async () => {
        if (currentStep === 1) {
            if (savedConditions.length === 0 || !formData.durationStart || !formData.durationEnd) {
                alert("최소 하나 이상의 조건과 기간을 설정해야 합니다.");
                return;
            }
            setIsAnalyzing(true);
            try {
                const createPayload: BackendPayload = {
                    conditions: savedConditions.map(({ id, ...rest }) => ({...rest, preferenceId: String(rest.preferenceId)}))
                };
                const createResponse = await fetch('http://localhost:8080/api/users', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createPayload),
                });
                if (!createResponse.ok) throw new Error('데이터 생성 요청 실패');
                
                const analyzeResponse = await fetch('http://localhost:8080/api/users/analyze');
                if (!analyzeResponse.ok) throw new Error('분석 결과 요청 실패');
                
                const analysisData = await analyzeResponse.json();
                if (analysisData.status.code === 'SUCCESS') {
                    setCurrentStep(2);
                } else {
                    throw new Error(analysisData.status.message || '분석 결과 처리에 실패했습니다.');
                }
            } catch (error) {
                alert((error as Error).message);
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };
    

    return {
        currentStep, formData, savedConditions, isLoading,
        ageGroupOptions, occupationOptions, preferenceOptions,
        isFormValid, handleInputChange, handleAddCondition, handleDeleteCondition,
        handleDateChange, prevStep, nextStep, isAnalyzing
    };

    
}