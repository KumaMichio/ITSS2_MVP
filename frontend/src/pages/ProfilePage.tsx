import { useEffect, useState } from 'react'
import { Save, Plus, X } from 'lucide-react'
import api from '../lib/api'
import { useStore } from '../store/useStore'
import { useT } from '../lib/useT'
import type { Profile } from '../types'

const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5']
const LOCATIONS = ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya', 'Fukuoka', 'Sapporo', 'Yokohama']
const SKILL_SUGGESTIONS = [
  'Java', 'Spring Boot', 'Python', 'React', 'TypeScript', 'Node.js', 'Go', 'PHP',
  'SQL', 'PostgreSQL', 'MySQL', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git',
  'Swift', 'iOS', 'Android', 'C++', 'TensorFlow', 'PyTorch',
]

interface FormErrors {
  name?: string
  experienceYears?: string
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-red-500 mt-1">{msg}</p>
}

export default function ProfilePage() {
  const { user, updateUser } = useStore()
  const t = useT()
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')

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

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = t.profile_err_name
    if (form.experienceYears !== '' && (Number(form.experienceYears) < 0 || !Number.isInteger(Number(form.experienceYears)))) {
      errs.experienceYears = t.profile_err_exp
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function addSkill(skill: string) {
    const s = skill.trim()
    if (!s) return
    if (form.skills.includes(s)) {
      setSkillInput('')
      return
    }
    setForm(p => ({ ...p, skills: [...p.skills, s] }))
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))
  }

  async function handleSave() {
    setApiError('')
    if (!validate()) return

    setSaving(true)
    setSaved(false)
    try {
      await api.put('/users/me/profile', {
        name: form.name.trim(),
        currentTitle: form.currentTitle || null,
        skills: form.skills,
        japaneseLevel: form.japaneseLevel || null,
        location: form.location || null,
        experienceYears: form.experienceYears !== '' ? Number(form.experienceYears) : null,
      })
      updateUser({ name: form.name.trim() })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setApiError(t.profile_save_failed)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-2xl border border-border" />

  const unusedSuggestions = SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s))

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">{t.profile_title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t.profile_sub}</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
        {/* Basic info */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">{t.profile_basic_info}</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                {t.profile_fullname} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => {
                  setForm(p => ({ ...p, name: e.target.value }))
                  if (e.target.value.trim()) setErrors(er => ({ ...er, name: undefined }))
                }}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.name ? 'border-red-400 focus:ring-red-300' : 'border-input'
                }`}
              />
              <FieldError msg={errors.name} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t.profile_current_role}</label>
              <input
                type="text"
                value={form.currentTitle}
                onChange={e => setForm(p => ({ ...p, currentTitle: e.target.value }))}
                placeholder={t.profile_role_placeholder}
                className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t.profile_exp_years}</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.experienceYears}
                  onChange={e => {
                    setForm(p => ({ ...p, experienceYears: e.target.value }))
                    if (!e.target.value || Number(e.target.value) >= 0)
                      setErrors(er => ({ ...er, experienceYears: undefined }))
                  }}
                  placeholder={t.profile_exp_placeholder}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                    errors.experienceYears ? 'border-red-400 focus:ring-red-300' : 'border-input'
                  }`}
                />
                <FieldError msg={errors.experienceYears} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">{t.profile_location}</label>
                <select
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">{t.profile_select_city}</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* JLPT */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">{t.profile_jlpt}</h2>
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
          <p className="text-xs text-muted-foreground mt-1.5">{t.profile_jlpt_hint}</p>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-2">{t.profile_skills}</h2>

          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[32px]">
            {form.skills.map(s => (
              <span key={s} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500">
                  <X size={11} />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && (
              <p className="text-xs text-muted-foreground">{t.profile_no_skills}</p>
            )}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder={t.profile_skill_placeholder}
              className="flex-1 px-3.5 py-2 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => addSkill(skillInput)}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
            </button>
          </div>

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
            {saving ? t.profile_saving : t.profile_save}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">{t.profile_saved}</span>}
          {apiError && <span className="text-sm text-red-500">{apiError}</span>}
        </div>
      </div>
    </div>
  )
}
