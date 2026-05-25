import { useEffect, useState } from 'react'
import { Brain, TrendingUp, Zap, CheckCircle, XCircle } from 'lucide-react'
import api from '../lib/api'
import type { Job, User } from '../types'
import { matchColor } from '../lib/utils'

interface SkillGap {
  skill: string
  jobCount: number
  hasSkill: boolean
}

export default function InsightsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/users/me'), api.get('/jobs')])
      .then(([u, j]) => { setUser(u.data); setJobs(j.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-border h-32 animate-pulse" />)}
      </div>
    )
  }

  const userSkills = (user?.profile?.skills ?? []).map(s => s.toLowerCase())
  const userJlpt = user?.profile?.japaneseLevel
  const userExp = user?.profile?.experienceYears ?? 0
  const userLocation = user?.profile?.location

  // Đếm tần suất từng skill trong thị trường
  const skillFreq: Record<string, number> = {}
  jobs.forEach(job => {
    job.requireSkills.forEach(s => {
      skillFreq[s] = (skillFreq[s] ?? 0) + 1
    })
  })

  // Phân loại: có / chưa có
  const allSkills: SkillGap[] = Object.entries(skillFreq)
    .map(([skill, jobCount]) => ({
      skill,
      jobCount,
      hasSkill: userSkills.includes(skill.toLowerCase()),
    }))
    .sort((a, b) => b.jobCount - a.jobCount)

  const missingSkills = allSkills.filter(s => !s.hasSkill)
  const ownedSkills = allSkills.filter(s => s.hasSkill)

  // Match score trung bình
  const jobsWithScore = jobs.filter(j => j.matchScore !== undefined)
  const avgScore = jobsWithScore.length
    ? Math.round(jobsWithScore.reduce((s, j) => s + (j.matchScore ?? 0), 0) / jobsWithScore.length)
    : 0

  // JLPT rank
  const jlptRank: Record<string, number> = { N1: 1, N2: 2, N3: 3, N4: 4, N5: 5 }
  const jlptNeeded = jobs
    .filter(j => j.requireJlpt)
    .map(j => jlptRank[j.requireJlpt!])
    .filter(Boolean)
  const highestNeeded = jlptNeeded.length ? Math.min(...jlptNeeded) : null
  const userRank = userJlpt ? jlptRank[userJlpt] : null
  const jlptOk = userRank !== null && highestNeeded !== null ? userRank <= highestNeeded : false

  const scoreColor = matchColor(avgScore)

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Brain size={18} className="text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Match Insights</h1>
      </div>

      {/* Avg score card */}
      <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke={scoreColor.stroke} strokeWidth="3"
              strokeDasharray={`${avgScore} ${100 - avgScore}`}
              strokeLinecap="round"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${scoreColor.text}`}>
            {avgScore}%
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">Điểm phù hợp trung bình</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Dựa trên {jobsWithScore.length} việc làm trong hệ thống
          </p>
          {avgScore < 60 && (
            <p className="text-xs text-amber-600 mt-1.5 bg-amber-50 px-2 py-1 rounded-md">
              Hãy bổ sung thêm kỹ năng để tăng điểm phù hợp
            </p>
          )}
          {avgScore >= 80 && (
            <p className="text-xs text-green-600 mt-1.5 bg-green-50 px-2 py-1 rounded-md">
              Hồ sơ của bạn rất cạnh tranh trên thị trường!
            </p>
          )}
        </div>
      </div>

      {/* JLPT status */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-primary" />
          <h2 className="font-semibold text-sm">Trình độ tiếng Nhật</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${userJlpt ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
            {userJlpt ?? 'Chưa khai báo'}
          </div>
          <span className="text-muted-foreground text-sm">→</span>
          <div className="text-sm text-muted-foreground">
            {highestNeeded
              ? `Thị trường yêu cầu cao nhất: N${highestNeeded}`
              : 'Không có yêu cầu JLPT'}
          </div>
          {userJlpt && (
            jlptOk
              ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle size={13} /> Đủ điều kiện</span>
              : <span className="flex items-center gap-1 text-xs text-red-500"><XCircle size={13} /> Cần nâng cấp</span>
          )}
        </div>
        {userExp !== null && (
          <p className="text-xs text-muted-foreground mt-2">
            Kinh nghiệm của bạn: <span className="font-medium text-foreground">{userExp} năm</span>
            {userLocation && <> · Địa điểm: <span className="font-medium text-foreground">{userLocation}</span></>}
          </p>
        )}
      </div>

      {/* Kỹ năng còn thiếu */}
      {missingSkills.length > 0 && (
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={15} className="text-amber-500" />
            <h2 className="font-semibold text-sm">Kỹ năng nên học thêm</h2>
            <span className="text-xs text-muted-foreground">— xuất hiện nhiều trong thị trường</span>
          </div>
          <div className="space-y-2">
            {missingSkills.map(({ skill, jobCount }) => (
              <div key={skill} className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-foreground">{skill}</span>
                  <span className="text-xs text-muted-foreground">({jobCount} job)</span>
                </div>
                <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(jobCount / jobs.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kỹ năng đang có */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle size={15} className="text-green-500" />
          <h2 className="font-semibold text-sm">Kỹ năng bạn đang có</h2>
        </div>
        {ownedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ownedSkills.map(({ skill, jobCount }) => (
              <span key={skill} className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-lg border border-green-100">
                <CheckCircle size={11} />
                {skill}
                <span className="text-green-500 font-medium">{jobCount}</span>
              </span>
            ))}
            {(user?.profile?.skills ?? [])
              .filter(s => !Object.keys(skillFreq).map(k => k.toLowerCase()).includes(s.toLowerCase()))
              .map(s => (
                <span key={s} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-lg">
                  {s}
                </span>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chưa có kỹ năng nào — hãy cập nhật hồ sơ tại trang Cài đặt.
          </p>
        )}
      </div>
    </div>
  )
}
