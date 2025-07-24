import { useState} from "react";

import type {
  FrontendFormDataItem
} from '../types';

const initialFormData: FrontendFormDataItem = {
  ageRange: "", gender: "", occupation: "", consumptionType: "",
  userCount: "", durationStart: undefined, durationEnd: undefined,
};
export function useGeneratePage() {
  const [currentStep] = useState(1);
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

    return {
        currentStep, formData, handleDateChange
    };
}