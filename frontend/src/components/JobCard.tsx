import { MapPin, Briefcase, Bookmark } from 'lucide-react'
import type { Job } from '../types'
import { formatSalary, timeAgo } from '../lib/utils'
import CompanyBadge from './CompanyBadge'
import TrustBadge from './TrustBadge'
import MatchCircle from './MatchCircle'
import { useStore } from '../store/useStore'

interface Props {
  job: Job & { matchScore?: number }
  onClick: () => void
  variant?: 'grid' | 'list'
}

export default function JobCard({ job, onClick, variant = 'list' }: Props) {
  const score = job.matchScore ?? 0
  const { bookmarkedIds, toggleBookmark } = useStore()
  const isBookmarked = bookmarkedIds.has(job.id)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <CompanyBadge logo={job.company.logo} logoColor={job.company.logoColor} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground text-sm leading-tight">{job.title}</h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                {job.company.name} · {timeAgo(job.postedAt)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); toggleBookmark(job.id) }}
                className={`p-1 rounded-lg transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              >
                <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <MatchCircle value={score} size={variant === 'grid' ? 52 : 48} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={11} /> {job.type}
            </span>
            {(job.salaryMin || job.salaryMax) && (
              <span className="font-medium text-foreground">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {job.requireSkills.slice(0, 3).map(s => (
              <span key={s} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-md">
                {s}
              </span>
            ))}
            {job.requireJlpt && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md border border-blue-100">
                {job.requireJlpt}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <TrustBadge score={job.company.trustScore} size="sm" />
            {job.risks.length > 0 && (
              <span className="text-xs text-red-500 font-medium">⚠ Có rủi ro</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
