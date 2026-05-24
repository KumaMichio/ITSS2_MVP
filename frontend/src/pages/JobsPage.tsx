import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import api from '../lib/api'
import type { Job, MatchResult } from '../types'
import JobCard from '../components/JobCard'
import JobDetailPanel from '../components/JobDetailPanel'

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote']
const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5']
const TRUST_OPTIONS = [
  { label: '85+ Verified', value: 85 },
  { label: '70+ Reliable', value: 70 },
  { label: 'Tất cả', value: 0 },
]

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  )
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer text-sm text-foreground hover:text-primary">
      <input type="checkbox" checked={checked} onChange={onChange} className="rounded border-input accent-primary w-3.5 h-3.5" />
      {label}
    </label>
  )
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [employmentFilters, setEmploymentFilters] = useState<string[]>([])
  const [jlptFilters, setJlptFilters] = useState<string[]>([])
  const [trustMin, setTrustMin] = useState(0)
  const [sort, setSort] = useState('best')
  const [selected, setSelected] = useState<Job | null>(null)
  const [match, setMatch] = useState<MatchResult | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [search, employmentFilters, jlptFilters, trustMin])

  async function fetchJobs() {
    setLoading(true)
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (employmentFilters.length === 1) params.type = employmentFilters[0]
    if (jlptFilters.length === 1) params.jlpt = jlptFilters[0]
    if (trustMin > 0) params.trustMin = String(trustMin)
    try {
      const { data } = await api.get('/jobs', { params })
      setJobs(data)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  async function openJob(job: Job) {
    setSelected(job)
    try {
      const { data } = await api.get(`/jobs/${job.id}/match`)
      setMatch(data)
    } catch {
      setMatch(null)
    }
  }

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sort === 'newest') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    return (b.matchScore ?? 0) - (a.matchScore ?? 0)
  })

  return (
    <div className="flex gap-5 max-w-5xl">
      {/* Filter panel */}
      <aside className="w-44 shrink-0">
        <FilterSection title="Employment">
          {EMPLOYMENT_TYPES.map(t => (
            <CheckItem
              key={t}
              label={t}
              checked={employmentFilters.includes(t)}
              onChange={() => setEmploymentFilters(p => toggle(p, t))}
            />
          ))}
        </FilterSection>

        <FilterSection title="JLPT Level">
          {JLPT_LEVELS.map(l => (
            <CheckItem
              key={l}
              label={l}
              checked={jlptFilters.includes(l)}
              onChange={() => setJlptFilters(p => toggle(p, l))}
            />
          ))}
        </FilterSection>

        <FilterSection title="Trust Score">
          {TRUST_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 py-1 cursor-pointer text-sm text-foreground hover:text-primary">
              <input
                type="radio"
                name="trust"
                checked={trustMin === opt.value}
                onChange={() => setTrustMin(opt.value)}
                className="accent-primary w-3.5 h-3.5"
              />
              {opt.label}
            </label>
          ))}
        </FilterSection>

        {(employmentFilters.length > 0 || jlptFilters.length > 0 || trustMin > 0 || search) && (
          <button
            onClick={() => { setEmploymentFilters([]); setJlptFilters([]); setTrustMin(0); setSearch('') }}
            className="text-xs text-red-500 hover:underline flex items-center gap-1"
          >
            <SlidersHorizontal size={11} /> Xóa filter
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo vị trí, kỹ năng, công ty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
          />
        </div>

        {/* Result header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="font-semibold text-foreground">{jobs.length}</span> việc làm phù hợp
          </p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-input rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring bg-white"
          >
            <option value="best">Phù hợp nhất</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>

        {/* Job list */}
        <div className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4 h-28 animate-pulse" />
            ))
          ) : sortedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
              Không tìm thấy việc làm phù hợp. Thử thay đổi bộ lọc.
            </div>
          ) : (
            sortedJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => openJob(job)} />
            ))
          )}
        </div>
      </div>

      {selected && (
        <JobDetailPanel job={selected} match={match} onClose={() => { setSelected(null); setMatch(null) }} />
      )}
    </div>
  )
}
