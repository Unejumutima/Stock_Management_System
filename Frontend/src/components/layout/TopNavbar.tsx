import { useState } from 'react'
import {
  BellIcon,
  CogIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from '../../constants/icons'
import { DEFAULT_SEARCH_PLACEHOLDER } from '../../constants/navigation'
import { inputClass } from '../../constants/theme'
import { useAuth } from '../../context/AuthContext'

type TopNavbarProps = {
  title: string
  subtitle: string
  searchPlaceholder?: string
  onMenuClick: () => void
  menuOpen: boolean
}

export function TopNavbar({
  title,
  subtitle,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  onMenuClick,
  menuOpen,
}: TopNavbarProps) {
  const [appearanceDark, setAppearanceDark] = useState(false)
  const { user } = useAuth()

  // Derive initials from the logged-in user's full name, fallback to '?'
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'
  const displayName = user?.fullName ?? 'User'
  const displayRole = user?.role ?? ''

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.03),0_12px_40px_-24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
          onClick={onMenuClick}
          aria-expanded={menuOpen}
          aria-controls="sidebar-nav"
        >
          <MenuIcon className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold tracking-tight text-[#0B2735] sm:text-xl">{title}</h1>
          <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="hidden min-w-0 flex-[1.1] max-w-md lg:block">
        <label className="relative block">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon className="size-[1.125rem]" />
          </span>
          <input type="search" placeholder={searchPlaceholder} className={inputClass} />
        </label>
      </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-0.5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <button
              type="button"
              onClick={() => setAppearanceDark((d) => !d)}
              className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-[#0B2735] hover:shadow-sm"
              aria-label={appearanceDark ? 'Switch to light appearance' : 'Switch to dark appearance'}
              aria-pressed={appearanceDark}
            >
              {appearanceDark ? <MoonIcon className="size-[1.25rem]" /> : <SunIcon className="size-[1.25rem]" />}
            </button>
            <button
              type="button"
              className="relative inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-[#0B2735] hover:shadow-sm"
              aria-label="Notifications, 2 unread"
            >
              <BellIcon className="size-[1.25rem]" />
              <span className="absolute -right-0.5 -top-0.5 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
                2
              </span>
            </button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-[#0B2735] hover:shadow-sm"
              aria-label="Settings"
            >
              <CogIcon className="size-[1.25rem]" />
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-2.5 rounded-2xl border border-transparent py-1 pl-1 pr-1.5 transition hover:border-slate-200/90 hover:bg-white hover:shadow-sm sm:pr-2.5"
            aria-label="Account menu"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0B2735] to-[#143d52] text-xs font-semibold text-white shadow-md ring-2 ring-white">
              {initials}
            </span>
            <span className="hidden text-left text-sm sm:block">
              <span className="block font-semibold text-[#0B2735]">{displayName}</span>
              <span className="block text-xs text-slate-500">{displayRole}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
