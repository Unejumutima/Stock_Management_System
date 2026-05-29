import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellIcon, CogIcon, MenuIcon, SearchIcon, XIcon } from '../../constants/icons'
import { DEFAULT_SEARCH_PLACEHOLDER } from '../../constants/navigation'
import { inputClass } from '../../constants/theme'
import { useAuth } from '../../context/AuthContext'
import { useNotifications, type Notification } from '../../context/NotificationContext'

type TopNavbarProps = {
  title: string
  subtitle: string
  searchPlaceholder?: string
  onMenuClick: () => void
  menuOpen: boolean
}

const SETTINGS_ITEMS = [
  {
    label: 'User Management',
    description: 'Manage system users and permissions',
    icon: (
      <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    adminOnly: true,
    path: '/users',
  },
  {
    label: 'Account settings',
    description: 'Manage your profile and password',
    icon: (
      <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    label: 'Data & exports',
    description: 'Manage backups and report exports',
    icon: (
      <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75M3.75 13.5v3.75" />
      </svg>
    ),
  },
  {
    label: 'System preferences',
    description: 'Language, timezone, currency',
    icon: (
      <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
]

// Icon per notification type
function NotifIcon({ type }: { type: Notification['type'] }) {
  const base = 'size-4 shrink-0'
  if (type === 'success') return (
    <svg className={`${base} text-emerald-600`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
  if (type === 'warning') return (
    <svg className={`${base} text-amber-500`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
  if (type === 'error') return (
    <svg className={`${base} text-rose-600`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  )
  // info
  return (
    <svg className={`${base} text-blue-500`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  )
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function TopNavbar({
  title,
  subtitle,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  onMenuClick,
  menuOpen,
}: TopNavbarProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { notifications, unreadCount, markRead, markAllRead, remove, clearAll } = useNotifications()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setSettingsOpen(false); setBellOpen(false) }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const initials = user?.fullName
    ? user.fullName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?'
  const displayName = user?.fullName ?? 'User'
  const displayRole = user?.role ?? ''

  // Filter notifications relevant to this user's role
  const ADMIN_ONLY_CATEGORIES = new Set(['low_stock', 'out_of_stock', 'new_user', 'unauthorized_attempt', 'report_ready'])
  const visibleNotifications = notifications.filter((n) => {
    if (ADMIN_ONLY_CATEGORIES.has(n.category)) return user?.role === 'admin'
    return true
  })
  const visibleUnread = visibleNotifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.03),0_12px_40px_-24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
          onClick={onMenuClick}
          aria-expanded={menuOpen}
          aria-controls="sidebar-nav"
        >
          <MenuIcon className="size-5" />
        </button>

        {/* Page title */}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold tracking-tight text-[#0B2735] sm:text-xl">{title}</h1>
          <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>
        </div>

        {/* Search bar */}
        <div className="hidden min-w-0 flex-[1.1] max-w-md lg:block">
          <label className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon className="size-[1.125rem]" />
            </span>
            <input type="search" placeholder={searchPlaceholder} className={inputClass} />
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-0.5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">

            {/* ── Bell / Notifications ── */}
            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => {
                  setBellOpen((o) => !o)
                  setSettingsOpen(false)
                }}
                className={`relative inline-flex size-10 items-center justify-center rounded-xl transition hover:bg-white hover:text-[#0B2735] hover:shadow-sm ${
                  bellOpen ? 'bg-white text-[#0B2735] shadow-sm' : 'text-slate-600'
                }`}
                aria-label={`Notifications${visibleUnread > 0 ? `, ${visibleUnread} unread` : ''}`}
                aria-expanded={bellOpen}
              >
                <BellIcon className="size-[1.25rem]" />
                {visibleUnread > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white">
                    {visibleUnread > 9 ? '9+' : visibleUnread}
                  </span>
                ) : null}
              </button>

              {bellOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-12px_rgba(15,23,42,0.2)] ring-1 ring-slate-100/80">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notifications</p>
                    <div className="flex items-center gap-2">
                      {visibleUnread > 0 ? (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-[11px] font-medium text-[#0B2735] hover:underline"
                        >
                          Mark all read
                        </button>
                      ) : null}
                      {visibleNotifications.length > 0 ? (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-[11px] font-medium text-slate-400 hover:text-rose-600"
                        >
                          Clear all
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* List */}
                  <ul className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {visibleNotifications.length === 0 ? (
                      <li className="px-4 py-10 text-center text-sm text-slate-400">
                        No notifications yet
                      </li>
                    ) : (
                      visibleNotifications.map((n) => (
                        <li
                          key={n.id}
                          className={`group flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
                        >
                          {/* Type icon */}
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <NotifIcon type={n.type} />
                          </span>

                          {/* Content */}
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left"
                            onClick={() => markRead(n.id)}
                          >
                            <p className={`text-sm leading-snug ${!n.read ? 'font-semibold text-slate-800' : 'font-medium text-slate-700'}`}>
                              {n.title}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{n.message}</p>
                            <p className="mt-1 text-[11px] text-slate-400">{timeAgo(n.createdAt)}</p>
                          </button>

                          {/* Dismiss */}
                          <button
                            type="button"
                            aria-label="Dismiss"
                            onClick={() => remove(n.id)}
                            className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-300 opacity-0 transition hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* ── Settings ── */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen((o) => !o)
                  setBellOpen(false)
                }}
                className={`inline-flex size-10 items-center justify-center rounded-xl transition hover:bg-white hover:shadow-sm ${
                  settingsOpen ? 'bg-white text-[#0B2735] shadow-sm' : 'text-slate-600'
                }`}
                aria-label="Settings"
                aria-expanded={settingsOpen}
                aria-haspopup="true"
              >
                <CogIcon className="size-[1.25rem]" />
              </button>

              {settingsOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-12px_rgba(15,23,42,0.2)] ring-1 ring-slate-100/80"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Settings</p>
                  </div>
                  <ul className="py-1.5">
                    {SETTINGS_ITEMS.filter((item) => !item.adminOnly || user?.role === 'admin').map((item) => (
                      <li key={item.label}>
                        <button
                          type="button"
                          role="menuitem"
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                          onClick={() => {
                            setSettingsOpen(false)
                            if (item.path) navigate(item.path)
                          }}
                        >
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            {item.icon}
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-slate-800">{item.label}</span>
                            <span className="block text-xs text-slate-500">{item.description}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-slate-100 px-4 py-3">
                    <p className="text-[11px] text-slate-400">Zuba House Stock Management v1.0</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Profile display — static */}
          <div className="flex cursor-default items-center gap-2.5 rounded-2xl py-1 pl-1 pr-1.5 sm:pr-2.5" aria-label="Logged in user">
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0B2735] to-[#143d52] text-xs font-semibold text-white shadow-md ring-2 ring-white">
              {initials}
            </span>
            <span className="hidden text-left text-sm sm:block">
              <span className="block font-semibold text-[#0B2735]">{displayName}</span>
              <span className="block text-xs text-slate-500">{displayRole}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
