import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, TrendingUp, Building2, Layers } from 'lucide-react'
import api from '../lib/api'
import { useStore } from '../store/useStore'
import type { DashboardStats, Job, MatchResult } from '../types'
import JobCard from '../components/JobCard'
import JobDetailPanel from '../components/JobDetailPanel'

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useStore()
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
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const firstName = user?.name?.split(' ').pop() ?? ''

  return (
    <div className="max-w-4xl">
      {/* Hero banner */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting}, {firstName}</p>
            <h1 className="text-2xl font-bold text-foreground mt-1">
              {loading ? '...' : `${stats?.topMatches.length ?? 0} vai trò phù hợp với bạn hôm nay`}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Xếp hạng theo kỹ năng, kinh nghiệm và mức độ phù hợp.
            </p>
          </div>
          <button
            onClick={() => { setLoading(true); api.get('/dashboard/stats').then(r => setStats(r.data)).finally(() => setLoading(false)) }}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} />
            Cập nhật
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          <StatCard
            icon={TrendingUp}
            label="Avg. Match Score"
            value={loading ? '—' : `${stats?.avgMatchScore ?? 0}%`}
            sub="Điểm phù hợp trung bình"
          />
          <StatCard
            icon={Building2}
            label="Verified Companies"
            value={loading ? '—' : stats?.verifiedCompanies ?? 0}
            sub="Công ty Trust ≥ 70"
          />
          <StatCard
            icon={Layers}
            label="Tổng việc làm"
            value={loading ? '—' : stats?.totalJobs ?? 0}
            sub="Đang tuyển dụng"
          />
        </div>
      </div>

      {/* Top matches */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Top matches cho bạn</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Xếp hạng theo kỹ năng, kinh nghiệm và mức phù hợp</p>
        </div>
        <button onClick={() => navigate('/jobs')} className="text-sm text-primary hover:underline flex items-center gap-1">
          Xem tất cả →
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
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
