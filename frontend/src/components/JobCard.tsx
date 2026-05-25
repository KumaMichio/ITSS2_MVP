import { MapPin, Briefcase, Bookmark } from 'lucide-react'
import type { Job } from '../types'
import { formatSalary, timeAgo } from '../lib/utils'
import CompanyBadge from './CompanyBadge'
import TrustBadge from './TrustBadge'
import MatchCircle from './MatchCircle'
import { useStore } from '../store/useStore'
import { useT } from '../lib/useT'

interface Props {
  job: Job & { matchScore?: number }
  onClick: () => void
  variant?: 'grid' | 'list'
}

export default function JobCard({ job, onClick, variant = 'list' }: Props) {
  const score = job.matchScore ?? 0
  const { bookmarkedIds, toggleBookmark, lang } = useStore()
  const t = useT()
  const isBookmarked = bookmarkedIds.has(job.id)

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <CompanyBadge logo={job.company.logo} logoColor={job.company.logoColor} size={52} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-base leading-snug">{job.title}</h3>
              <p className="text-muted-foreground text-sm mt-0.5">
                {job.company.name} · {timeAgo(job.postedAt, lang)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); toggleBookmark(job.id) }}
                className={`p-1.5 rounded-xl transition-colors ${isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
              >
                <Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <MatchCircle value={score} size={variant === 'grid' ? 58 : 54} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} /> {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={13} /> {job.type}
            </span>
            {(job.salaryMin || job.salaryMax) && (
              <span className="font-semibold text-foreground">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.requireSkills.slice(0, 3).map(s => (
              <span key={s} className="bg-secondary text-secondary-foreground text-xs font-medium px-2.5 py-1 rounded-lg">
                {s}
              </span>
            ))}
            {job.requireJlpt && (
              <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-blue-100">
                {job.requireJlpt}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <TrustBadge score={job.company.trustScore} size="sm" />
            {job.risks.length > 0 && (
              <span className="text-sm text-red-500 font-medium">⚠ {t.card_has_risks}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
