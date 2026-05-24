import { create } from 'zustand'
import type { User } from '../types'

interface Store {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

export const useStore = create<Store>(set => ({
  user: null,
  token: localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  updateUser: partial =>
    set(state => ({ user: state.user ? { ...state.user, ...partial } : null })),
}))
