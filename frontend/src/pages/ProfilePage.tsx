import { useEffect, useState } from 'react'
import { Save, Plus, X } from 'lucide-react'
import api from '../lib/api'
import { useStore } from '../store/useStore'
import type { Profile } from '../types'

const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5']
const LOCATIONS = ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya', 'Fukuoka', 'Sapporo', 'Yokohama']
const SKILL_SUGGESTIONS = [
  'Java', 'Spring Boot', 'Python', 'React', 'TypeScript', 'Node.js', 'Go', 'PHP',
  'SQL', 'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git',
  'Swift', 'iOS', 'Android', 'C++', 'TensorFlow', 'PyTorch',
]

export default function ProfilePage() {
  const { user, updateUser } = useStore()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    currentTitle: '',
    skills: [] as string[],
    japaneseLevel: '' as string,
    location: '',
    experienceYears: '' as string | number,
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(r => {
      const p: Profile | undefined = r.data.profile
      setForm({
        name: r.data.name ?? '',
        currentTitle: p?.currentTitle ?? '',
        skills: p?.skills ?? [],
        japaneseLevel: p?.japaneseLevel ?? '',
        location: p?.location ?? '',
        experienceYears: p?.experienceYears ?? '',
      })
    }).finally(() => setLoading(false))
  }, [])

  function addSkill(skill: string) {
    const s = skill.trim()
    if (s && !form.skills.includes(s)) {
      setForm(p => ({ ...p, skills: [...p.skills, s] }))
    }
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await api.put('/users/me/profile', {
        name: form.name,
        currentTitle: form.currentTitle || null,
        skills: form.skills,
        japaneseLevel: form.japaneseLevel || null,
        location: form.location || null,
        experienceYears: form.experienceYears !== '' ? Number(form.experienceYears) : null,
      })
      updateUser({ name: form.name })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-2xl border border-border" />

  const unusedSuggestions = SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s))

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground mt-0.5">CV của bạn được dùng để tính % phù hợp với từng job</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        {/* Basic info */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Thông tin cơ bản</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Họ và tên</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Vị trí hiện tại</label>
              <input
                type="text"
                value={form.currentTitle}
                onChange={e => setForm(p => ({ ...p, currentTitle: e.target.value }))}
                placeholder="VD: Backend Developer"
                className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Số năm kinh nghiệm</label>
                <input
                  type="number"
                  min={0}
                  value={form.experienceYears}
                  onChange={e => setForm(p => ({ ...p, experienceYears: e.target.value }))}
                  placeholder="VD: 3"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Địa điểm mong muốn</label>
                <select
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— Chọn thành phố —</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* JLPT */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Trình độ tiếng Nhật (JLPT)</h2>
          <div className="flex gap-2">
            {JLPT_LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setForm(p => ({ ...p, japaneseLevel: p.japaneseLevel === l ? '' : l }))}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  form.japaneseLevel === l
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white text-foreground border-border hover:border-primary/50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">Kỹ năng</h2>

          {/* Current skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.skills.map(s => (
              <span key={s} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500">
                  <X size={11} />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && (
              <p className="text-xs text-muted-foreground">Chưa có kỹ năng nào</p>
            )}
          </div>

          {/* Add skill input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder="Nhập kỹ năng và nhấn Enter"
              className="flex-1 px-3.5 py-2 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => addSkill(skillInput)}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {unusedSuggestions.slice(0, 12).map(s => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Đã lưu!</span>}
        </div>
      </div>
    </div>
  )
}
