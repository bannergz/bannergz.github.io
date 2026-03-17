export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export interface ExperienceEntry {
  period: string;
  role: string;
  company: string;
  highlights: string[];
}

export interface Achievement {
  metric: string;
  description: string;
}

export interface EducationEntry {
  period: string;
  degree: string;
  institution: string;
}

export interface LanguageEntry {
  language: string;
  level: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  skillCategories: SkillCategory[];
  experience: ExperienceEntry[];
  achievements: Achievement[];
  education: EducationEntry[];
  languages: LanguageEntry[];
  specializations: string[];
}
