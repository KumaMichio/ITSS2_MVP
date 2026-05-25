import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, TrendingUp, Building2, Layers } from 'lucide-react'
import api from '../lib/api'
import { useStore } from '../store/useStore'
import { useT } from '../lib/useT'
import type { DashboardStats, Job, MatchResult } from '../types'
import JobCard from '../components/JobCard'
import JobDetailPanel from '../components/JobDetailPanel'

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
          <Icon size={18} className="text-muted-foreground" />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1.5">{sub}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useStore()
  const t = useT()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Job | null>(null)
  const [match, setMatch] = useState<MatchResult | null>(null)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function openJob(job: Job) {
    setSelected(job)
    try {
      const { data } = await api.get(`/jobs/${job.id}/match`)
      setMatch(data)
    } catch {
      setMatch(null)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t.dash_good_morning : hour < 18 ? t.dash_good_afternoon : t.dash_good_evening
  const firstName = user?.name?.split(' ').pop() ?? ''

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-white rounded-2xl border border-border p-7 mb-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base text-muted-foreground">{greeting}, {firstName}</p>
            <h1 className="text-3xl font-bold text-foreground mt-1.5">
              {loading ? '...' : `${t.dash_matched_prefix}${stats?.topMatches.length ?? 0} ${t.dash_matched_suffix}`}
            </h1>
            <p className="text-base text-muted-foreground mt-2">{t.dash_ranked_by}</p>
          </div>
          <button
            onClick={() => { setLoading(true); api.get('/dashboard/stats').then(r => setStats(r.data)).finally(() => setLoading(false)) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
          >
            <RefreshCw size={15} />
            {t.dash_refresh}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-5 mt-6">
          <StatCard
            icon={TrendingUp}
            label="Avg. Match Score"
            value={loading ? '—' : `${stats?.avgMatchScore ?? 0}%`}
            sub={t.dash_avg_score_sub}
          />
          <StatCard
            icon={Building2}
            label="Verified Companies"
            value={loading ? '—' : stats?.verifiedCompanies ?? 0}
            sub={t.dash_verified_sub}
          />
          <StatCard
            icon={Layers}
            label={t.dash_total_jobs}
            value={loading ? '—' : stats?.totalJobs ?? 0}
            sub={t.dash_total_jobs_sub}
          />
        </div>
      </div>

      {/* Top matches */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t.dash_top_matches}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.dash_top_matches_sub}</p>
        </div>
        <button onClick={() => navigate('/jobs')} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          {t.dash_view_all}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border p-5 h-36 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {stats?.topMatches.map(job => (
            <JobCard key={job.id} job={job} onClick={() => openJob(job)} variant="grid" />
          ))}
        </div>
      )}

      {selected && (
        <JobDetailPanel job={selected} match={match} onClose={() => { setSelected(null); setMatch(null) }} />
      )}
    </div>
  )
}
