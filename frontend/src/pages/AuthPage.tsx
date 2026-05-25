import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import api from '../lib/api'
import { useStore } from '../store/useStore'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth, fetchBookmarks } = useStore()
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
      await fetchBookmarks()
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Đã có lỗi xảy ra')
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
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === 'login'
              ? 'Tìm việc IT tại Nhật phù hợp nhất với bạn'
              : 'Bắt đầu hành trình tìm việc tại Nhật'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Họ và tên"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
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
              {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
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
