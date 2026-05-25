import { X, MapPin, Briefcase, Globe, ExternalLink, AlertTriangle, CheckCircle, Bookmark } from 'lucide-react'
import type { Job, MatchResult } from '../types'
import { formatSalary } from '../lib/utils'
import CompanyBadge from './CompanyBadge'
import TrustBadge from './TrustBadge'
import MatchCircle from './MatchCircle'
import { useStore } from '../store/useStore'

interface Props {
  job: Job
  match: MatchResult | null
  onClose: () => void
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function JobDetailPanel({ job, match, onClose }: Props) {
  const { bookmarkedIds, toggleBookmark } = useStore()
  const isBookmarked = bookmarkedIds.has(job.id)

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto z-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-5 py-4 flex items-start gap-3">
          <CompanyBadge logo={job.company.logo} logoColor={job.company.logoColor} size={48} />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base text-foreground leading-tight">{job.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{job.company.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <TrustBadge score={job.company.trustScore} size="sm" />
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(job.id)}
            className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Quick info */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.type}</span>
            {(job.salaryMin || job.salaryMax) && (
              <span className="font-semibold text-foreground">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            )}
          </div>

          {/* Match breakdown */}
          {match && (
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Độ phù hợp của bạn</h3>
                <MatchCircle value={match.total} size={48} />
              </div>
              <div className="space-y-2">
                <BreakdownBar label="Kỹ năng" value={match.breakdown.skills} />
                <BreakdownBar label="Tiếng Nhật (JLPT)" value={match.breakdown.jlpt} />
                <BreakdownBar label="Địa điểm" value={match.breakdown.location} />
                <BreakdownBar label="Kinh nghiệm" value={match.breakdown.experience} />
              </div>
            </div>
          )}

          {/* Skills required */}
          <div>
            <h3 className="font-semibold text-sm mb-2">Kỹ năng yêu cầu</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requireSkills.map(s => (
                <span key={s} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-md">
                  {s}
                </span>
              ))}
              {job.requireJlpt && (
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md border border-blue-100">
                  JLPT {job.requireJlpt}
                </span>
              )}
            </div>
            {job.requireExp && (
              <p className="text-xs text-muted-foreground mt-2">Kinh nghiệm: {job.requireExp} năm</p>
            )}
            {job.requireEdu && (
              <p className="text-xs text-muted-foreground mt-1">Học vấn: {job.requireEdu}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm mb-2">Mô tả công việc</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Phúc lợi</h3>
              <ul className="space-y-1">
                {job.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {job.risks.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Cảnh báo rủi ro
              </h3>
              <ul className="space-y-1">
                {job.risks.map(r => (
                  <li key={r} className="text-xs text-red-600">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Company info */}
          <div className="border border-border rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">Thông tin công ty</h3>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              {job.company.size && <p>Quy mô: {job.company.size}</p>}
              {job.company.founded && <p>Thành lập: {job.company.founded}</p>}
              {job.company.glassdoor && <p>Glassdoor: ⭐ {job.company.glassdoor}/5</p>}
              {job.company.reviewCount > 0 && <p>{job.company.reviewCount} đánh giá</p>}
              {job.company.description && (
                <p className="mt-2 text-xs leading-relaxed">{job.company.description}</p>
              )}
            </div>
            {job.company.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 mt-3 text-xs text-primary hover:underline"
              >
                <Globe size={12} /> Website
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
