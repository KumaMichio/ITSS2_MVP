const JLPT_RANK: Record<string, number> = { N1: 1, N2: 2, N3: 3, N4: 4, N5: 5 }

export interface MatchInput {
  requireSkills: string[]
  requireJlpt: string | null
  requireExp: string | null
  location: string
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

export function calcMatchScore(
  userSkills: string[],
  userJlpt: string | null,
  userLocation: string | null,
  userExpYears: number | null,
  job: MatchInput
): MatchResult {
  // Skills: % of required skills the user has
  const skillScore =
    job.requireSkills.length === 0
      ? 100
      : Math.round(
          (job.requireSkills.filter(s =>
            userSkills.some(us => us.toLowerCase() === s.toLowerCase())
          ).length /
            job.requireSkills.length) *
            100
        )

  // JLPT: user must be at or above required level (lower number = higher level)
  let jlptScore = 50
  if (!job.requireJlpt) {
    jlptScore = 100
  } else if (userJlpt) {
    const userRank = JLPT_RANK[userJlpt] ?? 5
    const reqRank = JLPT_RANK[job.requireJlpt] ?? 5
    jlptScore = userRank <= reqRank ? 100 : Math.round((reqRank / userRank) * 100)
  }

  // Location: same city = full score
  const locationScore = !userLocation
    ? 70
    : userLocation.toLowerCase() === job.location.toLowerCase()
    ? 100
    : 60

  // Experience: parse "2+" → 2
  let expScore = 70
  if (job.requireExp && userExpYears !== null) {
    const reqYears = parseInt(job.requireExp) || 0
    expScore =
      reqYears === 0
        ? 100
        : userExpYears >= reqYears
        ? 100
        : Math.round((userExpYears / reqYears) * 100)
  }

  const total = Math.round(
    skillScore * 0.45 + jlptScore * 0.3 + locationScore * 0.15 + expScore * 0.1
  )

  return {
    total: Math.min(Math.max(total, 0), 100),
    breakdown: { skills: skillScore, jlpt: jlptScore, location: locationScore, experience: expScore },
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

export function calcMatchExplanation(
  userSkills: string[],
  userJlpt: string | null,
  userLocation: string | null,
  userExpYears: number | null,
  job: MatchInput & { title?: string }
): MatchExplanation {
  const strengths: ExplanationItem[] = []
  const weaknesses: ExplanationItem[] = []
  const suggestions: string[] = []

  // Skills
  const matchedSkills = job.requireSkills.filter(s =>
    userSkills.some(u => u.toLowerCase() === s.toLowerCase())
  )
  const missingSkills = job.requireSkills.filter(s =>
    !userSkills.some(u => u.toLowerCase() === s.toLowerCase())
  )

  if (job.requireSkills.length === 0) {
    strengths.push({ criterion: 'skills', detail: 'Không có yêu cầu kỹ năng đặc biệt' })
  } else if (missingSkills.length === 0) {
    strengths.push({ criterion: 'skills', detail: `Có đủ tất cả kỹ năng yêu cầu: ${matchedSkills.join(', ')}` })
  } else {
    if (matchedSkills.length > 0)
      strengths.push({ criterion: 'skills', detail: `Kỹ năng phù hợp: ${matchedSkills.join(', ')}` })
    weaknesses.push({ criterion: 'skills', detail: `Thiếu kỹ năng: ${missingSkills.join(', ')}` })
    suggestions.push(`Bổ sung ${missingSkills.slice(0, 2).join(', ')} để tăng điểm kỹ năng`)
  }

  // JLPT
  if (!job.requireJlpt) {
    strengths.push({ criterion: 'jlpt', detail: 'Job không yêu cầu JLPT' })
  } else if (!userJlpt) {
    weaknesses.push({ criterion: 'jlpt', detail: `Chưa khai báo JLPT, job yêu cầu ${job.requireJlpt}` })
    suggestions.push(`Lấy chứng chỉ JLPT ${job.requireJlpt} để tăng điểm tiếng Nhật`)
  } else {
    const userRank = JLPT_RANK[userJlpt] ?? 5
    const reqRank = JLPT_RANK[job.requireJlpt] ?? 5
    if (userRank <= reqRank) {
      strengths.push({ criterion: 'jlpt', detail: `JLPT ${userJlpt} đáp ứng yêu cầu ${job.requireJlpt}` })
    } else {
      weaknesses.push({ criterion: 'jlpt', detail: `JLPT ${userJlpt} chưa đủ, job yêu cầu ${job.requireJlpt} trở lên` })
      suggestions.push(`Nâng chứng chỉ JLPT lên ${job.requireJlpt} để đáp ứng yêu cầu`)
    }
  }

  // Location
  if (!userLocation) {
    weaknesses.push({ criterion: 'location', detail: 'Chưa khai báo địa điểm mong muốn' })
    suggestions.push('Cập nhật địa điểm mong muốn trong hồ sơ để tính điểm chính xác hơn')
  } else if (userLocation.toLowerCase() === job.location.toLowerCase()) {
    strengths.push({ criterion: 'location', detail: `Địa điểm phù hợp: ${job.location}` })
  } else {
    weaknesses.push({ criterion: 'location', detail: `Bạn muốn làm ở ${userLocation}, job ở ${job.location}` })
  }

  // Experience
  if (!job.requireExp) {
    strengths.push({ criterion: 'experience', detail: 'Không yêu cầu kinh nghiệm cụ thể' })
  } else if (userExpYears === null) {
    weaknesses.push({ criterion: 'experience', detail: `Chưa khai báo kinh nghiệm, job yêu cầu ${job.requireExp} năm` })
    suggestions.push('Cập nhật số năm kinh nghiệm trong hồ sơ')
  } else {
    const reqYears = parseInt(job.requireExp) || 0
    if (userExpYears >= reqYears) {
      strengths.push({ criterion: 'experience', detail: `${userExpYears} năm kinh nghiệm đáp ứng yêu cầu ${job.requireExp} năm` })
    } else {
      weaknesses.push({ criterion: 'experience', detail: `Có ${userExpYears} năm KN, yêu cầu ${job.requireExp} năm` })
      if (reqYears - userExpYears > 0)
        suggestions.push(`Cần thêm khoảng ${reqYears - userExpYears} năm kinh nghiệm`)
    }
  }

  return { strengths, weaknesses, suggestions, matchedSkills, missingSkills }
}

export function calcTrustScore(company: {
  founded: number | null
  size: string | null
  reviewCount: number
  glassdoor: number | null
  website: string | null
  linkedin: string | null
  risks?: string[]
}): number {
  let score = 0
  const currentYear = new Date().getFullYear()

  // Age (max 20)
  if (company.founded) {
    const age = currentYear - company.founded
    if (age > 30) score += 20
    else if (age > 10) score += 15
    else if (age > 5) score += 10
    else if (age >= 1) score += 5
  }

  // Size (max 25)
  const size = (company.size ?? '').toLowerCase()
  if (size.includes('100,000') || size.includes('tập đoàn')) score += 25
  else if (size.includes('10,000') || (size.includes('lớn') && !size.includes('5,000'))) score += 20
  else if (size.includes('5,000')) score += 18
  else if (size.includes('1,000') || size.includes('trung bình')) score += 15
  else if (size.includes('nhỏ')) score += 5

  // Reviews (max 20)
  if (company.reviewCount > 1000) score += 20
  else if (company.reviewCount > 100) score += 15
  else if (company.reviewCount > 10) score += 10
  else if (company.reviewCount > 0) score += 5

  // Glassdoor (max 20)
  if (company.glassdoor != null) {
    if (company.glassdoor >= 4.0) score += 20
    else if (company.glassdoor >= 3.5) score += 15
    else if (company.glassdoor >= 3.0) score += 10
    else score += 5
  }

  // Web presence (max 10)
  if (company.website) score += 5
  if (company.linkedin) score += 5

  // No risks (max 5)
  if (!company.risks || company.risks.length === 0) score += 5

  return Math.min(score, 100)
}
