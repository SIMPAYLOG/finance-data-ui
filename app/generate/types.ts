export interface FrontendFormDataItem {
  ageRange: string;
  gender: string;
  occupation: string;
  consumptionType: string;
  userCount: string;
  durationStart: Date | undefined;
  durationEnd: Date | undefined;
}

export interface AgeGroupOption {
  id: string;
  groupName: string;
}

export interface OccupationOption {
  id: string;
  categoryName: string;
}

export interface PreferenceOption {
  id: string;
  name: string;
}

export interface BackendOptionItem {
  id: number;
  userCount: number;
  preferenceId: string | number;
  ageGroup: string;
  gender: string;
  occupationCode: string | number;
}

export interface BackendPayload {
  conditions: Omit<BackendOptionItem, 'id'>[];
}

export interface FrontendCalculatedGraphs {
  ageData: { name: string; value: number }[];
  genderData: { name: string; value: number }[];
  consumptionData: { name: string; value: number }[];
  totalUserCount: number;
}

export interface FrontendCalculatedGraphs {
  ageData: { name: string; value: number }[];
  genderData: { name: string; value: number }[];
  consumptionData: { name: string; value: number }[];
  totalUserCount: number;
}