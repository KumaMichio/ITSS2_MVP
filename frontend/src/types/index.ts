export interface User {
  id: string
  email: string
  name: string
  profile?: Profile
}

export interface Profile {
  id: string
  userId: string
  skills: string[]
  japaneseLevel: string | null
  location: string | null
  experienceYears: number | null
  currentTitle: string | null
}

export interface Company {
  id: string
  name: string
  logo: string
  logoColor: string
  size: string | null
  founded: number | null
  website: string | null
  linkedin: string | null
  description: string | null
  reviewCount: number
  glassdoor: number | null
  trustScore: number
}

export interface Job {
  id: string
  title: string
  company: Company
  location: string
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  type: string
  postedAt: string
  description: string
  requireSkills: string[]
  requireJlpt: string | null
  requireExp: string | null
  requireEdu: string | null
  benefits: string[]
  risks: string[]
  matchScore?: number
}

export interface PaginatedJobs {
  data: Job[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface MatchResult {
  total: number
  breakdown: {
    skills: number
    jlpt: number
    location: number
    experience: number
  }
}

export interface ExplanationItem {
  criterion: string
  detail: string
}

export interface MatchExplanation {
  strengths: ExplanationItem[]
  weaknesses: ExplanationItem[]
  suggestions: string[]
  matchedSkills: string[]
  missingSkills: string[]
}

export interface DashboardStats {
  avgMatchScore: number
  verifiedCompanies: number
  totalJobs: number
  topMatches: (Job & { matchScore: number })[]
}
