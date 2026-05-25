import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../lib/api'
import { useT } from '../lib/useT'
import type { Job, MatchResult, PaginatedJobs } from '../types'
import JobCard from '../components/JobCard'
import JobDetailPanel from '../components/JobDetailPanel'

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote']
const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5']
const PER_PAGE = 10

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  )
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer text-sm text-foreground hover:text-primary">
      <input type="checkbox" checked={checked} onChange={onChange} className="rounded border-input accent-primary w-4 h-4 shrink-0" />
      {label}
    </label>
  )
}

export default function JobsPage() {
  const t = useT()
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [employmentFilters, setEmploymentFilters] = useState<string[]>([])
  const [jlptFilters, setJlptFilters] = useState<string[]>([])
  const [trustMin, setTrustMin] = useState(0)
  const [sort, setSort] = useState('best')
  const [selected, setSelected] = useState<Job | null>(null)
  const [match, setMatch] = useState<MatchResult | null>(null)

  const TRUST_OPTIONS = [
    { label: '85+ Verified', value: 85 },
    { label: '70+ Reliable', value: 70 },
    { label: t.jobs_trust_all, value: 0 },
  ]

  useEffect(() => {
    fetchJobs(1)
  }, [search, employmentFilters, jlptFilters, trustMin])

  useEffect(() => {
    fetchJobs(page)
  }, [page])

  async function fetchJobs(p: number) {
    setLoading(true)
    const params: Record<string, string> = { page: String(p), perPage: String(PER_PAGE) }
    if (search) params.search = search
    if (employmentFilters.length === 1) params.type = employmentFilters[0]
    if (jlptFilters.length === 1) params.jlpt = jlptFilters[0]
    if (trustMin > 0) params.trustMin = String(trustMin)
    try {
      const { data }: { data: PaginatedJobs } = await api.get('/jobs', { params })
      setJobs(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      setJobs([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  function resetFiltersAndFetch() {
    setEmploymentFilters([])
    setJlptFilters([])
    setTrustMin(0)
    setSearch('')
    setPage(1)
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

  function handleFilterChange(fn: () => void) {
    fn()
    setPage(1)
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sort === 'newest') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    return (b.matchScore ?? 0) - (a.matchScore ?? 0)
  })

  const hasActiveFilters = employmentFilters.length > 0 || jlptFilters.length > 0 || trustMin > 0 || search

  return (
    <div className="flex gap-7">
      {/* Filter panel */}
      <aside className="w-52 shrink-0">
        <FilterSection title={t.jobs_employment}>
          {EMPLOYMENT_TYPES.map(t2 => (
            <CheckItem
              key={t2} label={t2}
              checked={employmentFilters.includes(t2)}
              onChange={() => handleFilterChange(() => setEmploymentFilters(p => toggle(p, t2)))}
            />
          ))}
        </FilterSection>

        <FilterSection title={t.jobs_jlpt_level}>
          {JLPT_LEVELS.map(l => (
            <CheckItem
              key={l} label={l}
              checked={jlptFilters.includes(l)}
              onChange={() => handleFilterChange(() => setJlptFilters(p => toggle(p, l)))}
            />
          ))}
        </FilterSection>

        <FilterSection title={t.jobs_trust_score}>
          {TRUST_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer text-sm text-foreground hover:text-primary">
              <input
                type="radio" name="trust"
                checked={trustMin === opt.value}
                onChange={() => handleFilterChange(() => setTrustMin(opt.value))}
                className="accent-primary w-4 h-4 shrink-0"
              />
              {opt.label}
            </label>
          ))}
        </FilterSection>

        {hasActiveFilters && (
          <button
            onClick={resetFiltersAndFetch}
            className="text-sm text-red-500 hover:underline flex items-center gap-1.5 font-medium"
          >
            <SlidersHorizontal size={13} /> {t.jobs_clear_filters}
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-5">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.jobs_search_placeholder}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-input text-base focus:outline-none focus:ring-2 focus:ring-ring bg-white"
          />
        </div>

        {/* Result header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {t.jobs_showing_prefix && <>{t.jobs_showing_prefix} </>}
            <span className="font-semibold text-foreground">{total}</span>
            {' '}{t.jobs_showing_suffix}
          </p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-input rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring bg-white font-medium"
          >
            <option value="best">{t.jobs_sort_best}</option>
            <option value="newest">{t.jobs_sort_newest}</option>
          </select>
        </div>

        {/* Job list */}
        <div className="space-y-4">
          {loading ? (
            [...Array(PER_PAGE)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 h-32 animate-pulse" />
            ))
          ) : sortedJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground text-base">
              {t.jobs_empty}
            </div>
          ) : (
            sortedJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => openJob(job)} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t.jobs_page_prefix && <>{t.jobs_page_prefix} </>}
              <span className="font-semibold text-foreground">{page}</span>
              {' '}{t.jobs_page_of}{' '}
              {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} /> {t.jobs_prev}
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number
                  if (totalPages <= 5) {
                    p = i + 1
                  } else if (page <= 3) {
                    p = i + 1
                  } else if (page >= totalPages - 2) {
                    p = totalPages - 4 + i
                  } else {
                    p = page - 2 + i
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
              >
                {t.jobs_next} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <JobDetailPanel job={selected} match={match} onClose={() => { setSelected(null); setMatch(null) }} />
      )}
    </div>
  )
}
