import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import api from '../lib/api'
import { useStore } from '../store/useStore'
import { useT } from '../lib/useT'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth, fetchBookmarks, fetchApplications } = useStore()
  const t = useT()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const { data } = await api.post(endpoint, payload)
      setAuth(data.user, data.token)
      await Promise.all([fetchBookmarks(), fetchApplications()])
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(typeof msg === 'string' ? msg : t.auth_err_default)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground leading-tight">JobMatch JP</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Smart Hiring</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-7 shadow-sm">
          <h1 className="text-xl font-bold text-foreground mb-1">
            {mode === 'login' ? t.auth_login : t.auth_register}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === 'login' ? t.auth_login_sub : t.auth_register_sub}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <input
                type="text"
                placeholder={t.auth_fullname}
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
            <input
              type="email"
              placeholder={t.auth_email}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              placeholder={t.auth_password}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t.auth_processing : mode === 'login' ? t.auth_login : t.auth_register}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === 'login' ? t.auth_no_account : t.auth_has_account}{' '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'login' ? t.auth_signup : t.auth_login}
            </button>
          </p>

          {mode === 'login' && (
            <div className="mt-4 pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">Demo: demo@jobmatch.jp / demo123456</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
