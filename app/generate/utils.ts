import type { AgeGroupOption, OccupationOption, PreferenceOption } from './types';

export const getDisplayValue = (
    key: string, 
    value: string | number,
    options: {
        ageGroupOptions: AgeGroupOption[],
        occupationOptions: OccupationOption[],
        preferenceOptions: PreferenceOption[]
    }
): string => {
    const stringValue = String(value);
    if (key === 'ageGroup') return options.ageGroupOptions.find(opt => opt.id === stringValue)?.groupName || stringValue;
    if (key === 'occupationCode') return options.occupationOptions.find(opt => opt.id === stringValue)?.categoryName || stringValue;
    if (key === 'preferenceId') return options.preferenceOptions.find(opt => opt.id === stringValue)?.name || stringValue;
    
    const mappings: Record<string, Record<string, string>> = {
      gender: { 'MALE': '남성', 'FEMALE': '여성', 'MIX': '혼합'},
    };
    return mappings[key]?.[stringValue] || stringValue;
};

export const getLabelForKey = (key: string): string => {
    const labels: Record<string, string> = {
      ageGroup: '나이대', gender: '성별', occupationCode: '직업군',
      preferenceId: '소비성향', period: '기간', userCount: '사용자 수',
      ageDistribution: '나이대별', occupationDistribution: '직업별', genderDistribution: '성별',
    };
    return labels[key] || String(key);
};