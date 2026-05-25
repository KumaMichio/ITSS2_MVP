import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min: number | null, max: number | null, _currency = 'JPY') {
  if (!min && !max) return '—'
  const fmt = (n: number) => `¥${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${fmt(min)}+`
  return `~${fmt(max!)}`
}

export function timeAgo(dateStr: string, lang: 'en' | 'ja' = 'en') {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (lang === 'ja') {
    if (days === 0) return '今日'
    if (days === 1) return '1日前'
    if (days < 7) return `${days}日前`
    if (days < 30) return `${Math.floor(days / 7)}週間前`
    return `${Math.floor(days / 30)}ヶ月前`
  }
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

export function matchColor(score: number) {
  if (score >= 80) return { stroke: '#16a34a', text: 'text-green-600' }
  if (score >= 60) return { stroke: '#d97706', text: 'text-amber-600' }
  return { stroke: '#dc2626', text: 'text-red-600' }
}

export function trustColor(score: number) {
  if (score >= 85) return 'text-green-600 bg-green-50 border-green-200'
  if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
  return 'text-gray-500 bg-gray-50 border-gray-200'
}
