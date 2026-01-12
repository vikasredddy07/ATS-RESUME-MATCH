
export type ResumeTemplate = 'standard' | 'modern' | 'minimalist' | 'two-column';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  school: string;
  degree: string;
  graduationDate: string;
  location: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface OptimizationResult {
  optimizedResume: ResumeData;
  atsScore: number;
  suggestions: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
}
