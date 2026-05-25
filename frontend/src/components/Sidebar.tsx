import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Brain, ShieldCheck, Bookmark, Settings, LogOut, Languages } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useT } from '../lib/useT'
import { cn } from '../lib/utils'

export default function Sidebar() {
  const { user, clearAuth, lang, setLang } = useStore()
  const t = useT()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Workspace', items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/jobs', icon: Briefcase, label: t.nav_jobs },
      { to: '/bookmarks', icon: Bookmark, label: t.nav_saved },
    ]},
    { label: 'Intelligence', items: [
      { to: '/insights', icon: Brain, label: 'Match Insights' },
      { to: '/trust', icon: ShieldCheck, label: 'Trust Scores' },
    ]},
  ]

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border flex flex-col z-20">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Briefcase size={18} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground leading-tight">JobMatch JP</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Smart Hiring</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
        {navItems.map(group => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 space-y-1">
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ja' : 'en')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <Languages size={18} />
          {t.nav_lang_toggle}
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )
          }
        >
          <Settings size={18} />
          {t.nav_settings}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          {t.nav_signout}
        </button>
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 bg-secondary rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary text-white text-sm flex items-center justify-center font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
