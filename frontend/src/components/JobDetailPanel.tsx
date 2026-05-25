import { useState, useEffect } from 'react'
import { X, MapPin, Briefcase, Globe, ExternalLink, AlertTriangle, CheckCircle, Bookmark, Send, CheckCheck, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react'
import type { Job, MatchResult, MatchExplanation } from '../types'
import { formatSalary } from '../lib/utils'
import CompanyBadge from './CompanyBadge'
import TrustBadge from './TrustBadge'
import MatchCircle from './MatchCircle'
import { useStore } from '../store/useStore'
import { useT } from '../lib/useT'
import api from '../lib/api'

interface Props {
  job: Job
  match: MatchResult | null
  onClose: () => void
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function JobDetailPanel({ job, match, onClose }: Props) {
  const { bookmarkedIds, toggleBookmark, appliedIds, applyJob, unapplyJob } = useStore()
  const t = useT()
  const isBookmarked = bookmarkedIds.has(job.id)
  const isApplied = appliedIds.has(job.id)

  const [applying, setApplying] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [explanation, setExplanation] = useState<MatchExplanation | null>(null)

  useEffect(() => {
    api.get(`/jobs/${job.id}/match-explanation`)
      .then(r => setExplanation(r.data))
      .catch(() => setExplanation(null))
  }, [job.id])

  async function handleApply() {
    if (isApplied) {
      await unapplyJob(job.id)
      setShowConfirm(false)
      return
    }
    setShowConfirm(true)
  }

  async function confirmApply() {
    setApplying(true)
    setApplyError('')
    try {
      await applyJob(job.id)
      setShowConfirm(false)
    } catch {
      setApplyError(t.detail_apply_failed)
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white shadow-2xl overflow-y-auto z-50">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-5 flex items-start gap-4">
          <CompanyBadge logo={job.company.logo} logoColor={job.company.logoColor} size={56} />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg text-foreground leading-snug">{job.title}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{job.company.name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <TrustBadge score={job.company.trustScore} size="sm" />
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(job.id)}
            className={`p-2 rounded-xl transition-colors ${isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin size={15} />{job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase size={15} />{job.type}</span>
            {(job.salaryMin || job.salaryMax) && (
              <span className="font-bold text-foreground text-base">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            )}
          </div>

          {/* Apply button */}
          <div>
            {showConfirm && !isApplied ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-3">
                  {t.detail_confirm_apply_prefix} <span className="font-bold">{job.title}</span>{t.detail_confirm_apply_suffix}
                </p>
                {applyError && <p className="text-sm text-red-500 mb-2">{applyError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={confirmApply}
                    disabled={applying}
                    className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <Send size={14} />
                    {applying ? t.detail_sending : t.detail_confirm}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    {t.detail_cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleApply}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isApplied
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                {isApplied ? (
                  <><CheckCheck size={16} /> {t.detail_applied}</>
                ) : (
                  <><Send size={16} /> {t.detail_apply_now}</>
                )}
              </button>
            )}
          </div>

          {/* Match breakdown */}
          {match && (
            <div className="bg-secondary rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base">{t.detail_match_title}</h3>
                <MatchCircle value={match.total} size={56} />
              </div>
              <div className="space-y-3">
                <BreakdownBar label={t.detail_skills_pct} value={match.breakdown.skills} />
                <BreakdownBar label={t.detail_jlpt_pct} value={match.breakdown.jlpt} />
                <BreakdownBar label={t.detail_location_pct} value={match.breakdown.location} />
                <BreakdownBar label={t.detail_experience_pct} value={match.breakdown.experience} />
              </div>
            </div>
          )}

          {/* Match explanation */}
          {explanation && (explanation.strengths.length > 0 || explanation.weaknesses.length > 0) && (
            <div className="border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base">{t.detail_why_match}</h3>

              {explanation.strengths.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-green-700 font-semibold text-sm mb-2">
                    <ThumbsUp size={14} /> {t.detail_strengths}
                  </div>
                  <ul className="space-y-1.5">
                    {explanation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                        {s.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {explanation.weaknesses.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-red-600 font-semibold text-sm mb-2">
                    <ThumbsDown size={14} /> {t.detail_weaknesses}
                  </div>
                  <ul className="space-y-1.5">
                    {explanation.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-red-400 mt-0.5 shrink-0 font-bold">✕</span>
                        {w.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {explanation.suggestions.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-sm mb-2">
                    <Lightbulb size={14} /> {t.detail_suggestions}
                  </div>
                  <ul className="space-y-1">
                    {explanation.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-amber-800">→ {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Skills required */}
          <div>
            <h3 className="font-bold text-base mb-3">{t.detail_req_skills}</h3>
            <div className="flex flex-wrap gap-2">
              {job.requireSkills.map(s => {
                const matched = explanation?.matchedSkills.some(m => m.toLowerCase() === s.toLowerCase())
                return (
                  <span
                    key={s}
                    className={`text-sm font-medium px-3 py-1 rounded-lg border ${
                      matched
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-secondary text-secondary-foreground border-transparent'
                    }`}
                  >
                    {matched ? '✓ ' : ''}{s}
                  </span>
                )
              })}
              {job.requireJlpt && (
                <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-lg border border-blue-100">
                  JLPT {job.requireJlpt}
                </span>
              )}
            </div>
            {job.requireExp && (
              <p className="text-sm text-muted-foreground mt-3">
                {t.detail_min_exp_prefix} {job.requireExp} {t.detail_min_exp_suffix}
              </p>
            )}
            {job.requireEdu && (
              <p className="text-sm text-muted-foreground mt-1.5">{t.detail_education} {job.requireEdu}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-base mb-3">{t.detail_description}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div>
              <h3 className="font-bold text-base mb-3">{t.detail_benefits}</h3>
              <ul className="space-y-2">
                {job.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {job.risks.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <h3 className="font-bold text-base text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} /> {t.detail_risks}
              </h3>
              <ul className="space-y-1.5">
                {job.risks.map(r => (
                  <li key={r} className="text-sm text-red-600">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Company info */}
          <div className="border border-border rounded-2xl p-5">
            <h3 className="font-bold text-base mb-4">{t.detail_company_info}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {job.company.size && <p>{t.detail_company_size} <span className="text-foreground font-medium">{job.company.size}</span></p>}
              {job.company.founded && <p>{t.detail_company_founded} <span className="text-foreground font-medium">{job.company.founded}</span></p>}
              {job.company.glassdoor && <p>Glassdoor: <span className="text-foreground font-medium">⭐ {job.company.glassdoor}/5</span></p>}
              {job.company.reviewCount > 0 && <p><span className="text-foreground font-medium">{job.company.reviewCount}</span> {t.detail_company_reviews}</p>}
              {job.company.description && (
                <p className="mt-3 text-sm leading-relaxed">{job.company.description}</p>
              )}
            </div>
            {job.company.website && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 text-sm text-primary hover:underline font-medium"
              >
                <Globe size={14} /> {t.detail_website}
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
