import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import api from '../lib/api'
import { useT } from '../lib/useT'
import type { Job, MatchResult } from '../types'
import JobCard from '../components/JobCard'
import JobDetailPanel from '../components/JobDetailPanel'
import { useStore } from '../store/useStore'

export default function BookmarksPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Job | null>(null)
  const [match, setMatch] = useState<MatchResult | null>(null)
  const { bookmarkedIds } = useStore()
  const t = useT()

  useEffect(() => {
    fetchBookmarks()
  }, [])

  useEffect(() => {
    setJobs(prev => prev.filter(j => bookmarkedIds.has(j.id)))
  }, [bookmarkedIds])

  async function fetchBookmarks() {
    setLoading(true)
    try {
      const { data } = await api.get('/bookmarks')
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

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-5">
        <Bookmark size={18} className="text-primary" fill="currentColor" />
        <h1 className="text-lg font-semibold text-foreground">{t.bookmarks_title}</h1>
        {!loading && (
          <span className="text-sm text-muted-foreground">({jobs.length})</span>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 h-28 animate-pulse" />
          ))
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-10 text-center">
            <Bookmark size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">{t.bookmarks_empty_title}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.bookmarks_empty_hint}</p>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} onClick={() => openJob(job)} />
          ))
        )}
      </div>

      {selected && (
        <JobDetailPanel job={selected} match={match} onClose={() => { setSelected(null); setMatch(null) }} />
      )}
    </div>
  )
}
