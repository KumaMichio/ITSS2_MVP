import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Brain, ShieldCheck, Bookmark, Settings, LogOut } from 'lucide-react'
import { useStore } from '../store/useStore'
import { cn } from '../lib/utils'

const navItems = [
  { label: 'Workspace', items: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Việc làm' },
    { to: '/bookmarks', icon: Bookmark, label: 'Việc đã lưu' },
  ]},
  { label: 'Intelligence', items: [
    { to: '/insights', icon: Brain, label: 'Match Insights' },
    { to: '/trust', icon: ShieldCheck, label: 'Trust Scores' },
  ]},
]

export default function Sidebar() {
  const { user, clearAuth } = useStore()
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-border flex flex-col z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Briefcase size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">JobMatch JP</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Smart Hiring</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navItems.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )
          }
        >
          <Settings size={16} />
          Cài đặt
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
        {user && (
          <div className="flex items-center gap-2 px-2.5 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-primary text-white text-xs flex items-center justify-center font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
