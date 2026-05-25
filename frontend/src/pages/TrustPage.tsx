import { useEffect, useState } from 'react'
import { ShieldCheck, Shield, ShieldAlert, Globe, Star, Users, Calendar } from 'lucide-react'
import api from '../lib/api'
import { useT } from '../lib/useT'
import type { Company, Job } from '../types'

interface RankedCompany extends Company {
  jobCount: number
}

function TrustBar({ label, score, max }: { label: string; score: number; max: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/60 rounded-full"
          style={{ width: `${(score / max) * 100}%` }}
        />
      </div>
      <span className="w-8 text-right font-medium text-foreground">{score}/{max}</span>
    </div>
  )
}

function TrustIcon({ score }: { score: number }) {
  if (score >= 85) return <ShieldCheck size={16} className="text-green-600" />
  if (score >= 70) return <Shield size={16} className="text-blue-600" />
  return <ShieldAlert size={16} className="text-gray-400" />
}

function badgeClass(score: number) {
  if (score >= 85) return 'bg-green-50 text-green-700 border-green-200'
  if (score >= 70) return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-gray-50 text-gray-500 border-gray-200'
}

export default function TrustPage() {
  const [companies, setCompanies] = useState<RankedCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<RankedCompany | null>(null)
  const t = useT()

  useEffect(() => {
    api.get('/jobs', { params: { perPage: 100 } })
      .then(({ data }) => {
        const jobs: Job[] = data.data ?? []
        const map: Record<string, RankedCompany> = {}
        jobs.forEach(j => {
          if (!map[j.company.id]) {
            map[j.company.id] = { ...j.company, jobCount: 0 }
          }
          map[j.company.id].jobCount++
        })
        const ranked = Object.values(map).sort((a, b) => b.trustScore - a.trustScore)
        setCompanies(ranked)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl flex gap-5">
      {/* List */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={18} className="text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Trust Scores</h1>
          <span className="text-sm text-muted-foreground">{t.trust_subtitle}</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {companies.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${selected?.id === c.id ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-sm font-bold shrink-0 ${i < 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {i + 1}
                  </span>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: c.logoColor }}
                  >
                    {c.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{c.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      {c.size && <span className="flex items-center gap-1"><Users size={10} />{c.size}</span>}
                      {c.founded && <span className="flex items-center gap-1"><Calendar size={10} />{c.founded}</span>}
                      {c.glassdoor && <span className="flex items-center gap-1"><Star size={10} />{c.glassdoor}/5</span>}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-semibold shrink-0 ${badgeClass(c.trustScore)}`}>
                    <TrustIcon score={c.trustScore} />
                    {c.trustScore}
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${c.trustScore >= 85 ? 'bg-green-500' : c.trustScore >= 70 ? 'bg-blue-500' : 'bg-gray-400'}`}
                    style={{ width: `${c.trustScore}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail / criteria panel */}
      <div className="w-60 shrink-0 space-y-4">
        {selected ? (
          <div className="bg-white rounded-xl border border-border p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: selected.logoColor }}
              >
                {selected.logo}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{selected.name}</p>
                <div className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded border ${badgeClass(selected.trustScore)}`}>
                  <TrustIcon score={selected.trustScore} />
                  {selected.trustScore >= 85 ? 'Verified' : selected.trustScore >= 70 ? 'Reliable' : t.trust_caution}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <TrustBar label={t.trust_company_age} score={selected.founded ? Math.min(20, Math.max(0, Math.floor((2025 - selected.founded) / 1.5))) : 5} max={20} />
              <TrustBar label={t.trust_size} score={selected.size?.includes('>100k') ? 25 : selected.size?.includes('>10k') ? 20 : selected.size?.includes('>5k') ? 18 : selected.size?.includes('>1k') ? 15 : 5} max={25} />
              <TrustBar label={t.trust_glassdoor} score={selected.glassdoor ? (selected.glassdoor >= 4 ? 20 : selected.glassdoor >= 3.5 ? 15 : 10) : 0} max={20} />
              <TrustBar label={t.trust_reviews} score={selected.reviewCount > 1000 ? 20 : selected.reviewCount > 100 ? 15 : selected.reviewCount > 10 ? 10 : 5} max={20} />
            </div>

            {selected.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{selected.description}</p>
            )}
            {selected.website && (
              <a href={selected.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                <Globe size={11} /> {t.trust_website}
              </a>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border p-4 sticky top-4">
            <p className="font-semibold text-sm mb-3">{t.trust_criteria}</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>{t.trust_company_age}</span><span className="font-medium">20pt</span></div>
              <div className="flex justify-between"><span>{t.trust_headcount}</span><span className="font-medium">25pt</span></div>
              <div className="flex justify-between"><span>{t.trust_glassdoor_rating}</span><span className="font-medium">20pt</span></div>
              <div className="flex justify-between"><span>{t.trust_review_count}</span><span className="font-medium">20pt</span></div>
              <div className="flex justify-between"><span>{t.trust_website}</span><span className="font-medium">5pt</span></div>
              <div className="flex justify-between"><span>{t.trust_linkedin}</span><span className="font-medium">5pt</span></div>
              <div className="flex justify-between"><span>{t.trust_no_risks}</span><span className="font-medium">5pt</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground">
                <span>{t.trust_total}</span><span>100pt</span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-green-600"><ShieldCheck size={12} /> ≥ 85: Verified</div>
              <div className="flex items-center gap-1.5 text-blue-600"><Shield size={12} /> 70–84: Reliable</div>
              <div className="flex items-center gap-1.5 text-gray-400"><ShieldAlert size={12} /> &lt; 70: {t.trust_caution}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">{t.trust_click_hint}</p>
          </div>
        )}
      </div>
    </div>
  )
}
