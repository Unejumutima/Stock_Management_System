import { NavLink, useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.png'
import { LogOutIcon, NavIconUsers } from '../../constants/icons'
import { NAV_ITEMS } from '../../constants/navigation'
import { colors } from '../../constants/theme'
import { useAuth } from '../../context/AuthContext'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const isAdmin = user?.role === 'admin'

  return (
    <aside
      id="sidebar-nav"
      className={`fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(15,23,42,0.08)] transition-transform duration-200 ease-out md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
      style={{ backgroundColor: colors.primary }}
    >
      <div className="flex h-[4.25rem] items-center gap-3 border-b border-white/[0.08] px-5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
        <img src={logoImg} alt="" className="size-10 rounded-xl bg-white/[0.08] object-contain p-1.5 ring-1 ring-white/10" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold tracking-tight text-white">Zuba House</p>
          <p className="truncate text-[11px] font-medium text-white/50">Stock Management</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.14] text-white shadow-[inset_3px_0_0_0_rgba(255,255,255,0.9)] ring-1 ring-white/[0.06]'
                  : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`size-[1.125rem] shrink-0 ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/90'}`}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {/* Admin-only: User Management */}
        {isAdmin ? (
          <>
            <div className="mx-3 my-3 border-t border-white/[0.08]" />
            <NavLink
              to="/users"
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/[0.14] text-white shadow-[inset_3px_0_0_0_rgba(255,255,255,0.9)] ring-1 ring-white/[0.06]'
                    : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIconUsers
                    className={`size-[1.125rem] shrink-0 ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white/90'}`}
                  />
                  User Management
                </>
              )}
            </NavLink>
          </>
        ) : null}
      </nav>

      <div className="mt-auto shrink-0 space-y-3 border-t border-white/[0.08] p-4 pb-5">
        <div className="rounded-xl bg-white/[0.05] p-3.5 ring-1 ring-white/[0.08] backdrop-blur-sm">
          <p className="text-xs font-medium text-white/85">Warehouse sync</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/45">Last full reconciliation: today, 06:12 WAT</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <LogOutIcon className="size-[1.125rem] shrink-0 opacity-80" />
          Log out
        </button>
      </div>
    </aside>
  )
}
