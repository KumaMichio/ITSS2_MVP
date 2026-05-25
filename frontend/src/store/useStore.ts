import { create } from 'zustand'
import type { User } from '../types'
import api from '../lib/api'

interface Store {
  user: User | null
  token: string | null
  bookmarkedIds: Set<string>
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
  fetchBookmarks: () => Promise<void>
  toggleBookmark: (jobId: string) => Promise<void>
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  bookmarkedIds: new Set(),
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, bookmarkedIds: new Set() })
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
    // optimistic update
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
      // rollback nếu lỗi
      set(state => {
        const next = new Set(state.bookmarkedIds)
        isBookmarked ? next.add(jobId) : next.delete(jobId)
        return { bookmarkedIds: next }
      })
    }
  },
}))
