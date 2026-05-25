import { create } from 'zustand'
import type { User } from '../types'
import type { Lang } from '../lib/i18n'
import api from '../lib/api'

interface Store {
  user: User | null
  token: string | null
  bookmarkedIds: Set<string>
  appliedIds: Set<string>
  lang: Lang
  setLang: (lang: Lang) => void
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
  fetchBookmarks: () => Promise<void>
  toggleBookmark: (jobId: string) => Promise<void>
  fetchApplications: () => Promise<void>
  applyJob: (jobId: string) => Promise<void>
  unapplyJob: (jobId: string) => Promise<void>
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  bookmarkedIds: new Set(),
  appliedIds: new Set(),
  lang: (localStorage.getItem('lang') as Lang) ?? 'en',

  setLang: (lang) => {
    localStorage.setItem('lang', lang)
    set({ lang })
  },

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, bookmarkedIds: new Set(), appliedIds: new Set() })
  },
  updateUser: partial =>
    set(state => ({ user: state.user ? { ...state.user, ...partial } : null })),

  fetchBookmarks: async () => {
    try {
      const { data } = await api.get('/bookmarks')
      set({ bookmarkedIds: new Set(data.map((j: { id: string }) => j.id)) })
    } catch {
      // không làm gì nếu chưa login
    }
  },

  toggleBookmark: async (jobId: string) => {
    const { bookmarkedIds } = get()
    const isBookmarked = bookmarkedIds.has(jobId)
    set(state => {
      const next = new Set(state.bookmarkedIds)
      isBookmarked ? next.delete(jobId) : next.add(jobId)
      return { bookmarkedIds: next }
    })
    try {
      if (isBookmarked) {
        await api.delete(`/bookmarks/${jobId}`)
      } else {
        await api.post(`/bookmarks/${jobId}`)
      }
    } catch {
      set(state => {
        const next = new Set(state.bookmarkedIds)
        isBookmarked ? next.add(jobId) : next.delete(jobId)
        return { bookmarkedIds: next }
      })
    }
  },

  fetchApplications: async () => {
    try {
      const { data } = await api.get('/applications')
      set({ appliedIds: new Set(data.map((j: { id: string }) => j.id)) })
    } catch {
      // không làm gì nếu chưa login
    }
  },

  applyJob: async (jobId: string) => {
    set(state => ({ appliedIds: new Set([...state.appliedIds, jobId]) }))
    try {
      await api.post(`/applications/${jobId}`)
    } catch {
      set(state => {
        const next = new Set(state.appliedIds)
        next.delete(jobId)
        return { appliedIds: next }
      })
      throw new Error('Apply failed')
    }
  },

  unapplyJob: async (jobId: string) => {
    set(state => {
      const next = new Set(state.appliedIds)
      next.delete(jobId)
      return { appliedIds: next }
    })
    try {
      await api.delete(`/applications/${jobId}`)
    } catch {
      set(state => ({ appliedIds: new Set([...state.appliedIds, jobId]) }))
    }
  },
}))
