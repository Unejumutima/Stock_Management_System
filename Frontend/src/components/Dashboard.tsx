import { useState, type ReactNode } from 'react'
import logoImg from '../assets/logo.png'

const primary = '#0B2735'
const pageBg = '#F5F7FA'

function IconBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2735]/[0.06] text-[#0B2735] ${className ?? ''}`}
    >
      {children}
    </span>
  )
}

function NavIconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75A2.25 2.25 0 0 1 15.75 13.5H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM3.75 13.5A2.25 2.25 0 0 1 6 11.25h2.25A2.25 2.25 0 0 1 10.5 13.5V18A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-4.5Z" />
    </svg>
  )
}

function NavIconCube({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5v9l9 5.25M3 7.5l9 5.25m0-9v9m0-9 9 5.25" />
    </svg>
  )
}

function NavIconArchive({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  )
}

function NavIconCart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}

function NavIconReceipt({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25 6 18m-3-3.75 6-3.75m-3 3.75 5.25-5.25M9 5.25h4.5m2.25 3H15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H5.625A1.875 1.875 0 0 0 3.75 5.625v12.75A1.875 1.875 0 0 0 5.625 20.25h12.75a1.875 1.875 0 0 0 1.875-1.875V9.75L15 3.75H9Z" />
    </svg>
  )
}

function NavIconChart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}

function NavIconWallet({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-3-3m6.75 5.25v4.125c0 .621-.504 1.125-1.125 1.125H4.875A1.875 1.875 0 0 1 3 16.125V7.875C3 6.839 3.84 6 4.875 6h11.25c.621 0 1.125.504 1.125 1.125v0c0 .621.504 1.125 1.125 1.125H18a2.25 2.25 0 0 1 2.25 2.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h.008v.008H15V12Z" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function CogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.17-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.292.24-.437.613-.43.992a6.932 6.932 0 0 1 0 .255c-.008.378.137.75.43.99l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.37.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.379-.138-.75-.43-.99l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.281Z" />
      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function TrendUp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
    </svg>
  )
}

function TrendDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.45m0 0 3.622-3.622m-3.622 3.622L15.75 21" />
    </svg>
  )
}

const navItems: { label: string; icon: typeof NavIconDashboard; active?: boolean }[] = [
  { label: 'Dashboard', icon: NavIconDashboard, active: true },
  { label: 'Products', icon: NavIconCube },
  { label: 'Inventory', icon: NavIconArchive },
  { label: 'Purchases', icon: NavIconCart },
  { label: 'Sales', icon: NavIconReceipt },
  { label: 'Expenses', icon: NavIconWallet },
  { label: 'Reports', icon: NavIconChart },
]

function InventoryValueChartPlaceholder() {
  const w = 640
  const h = 220
  const pad = 24
  const path =
    `M ${pad} ${h - pad * 1.2} ` +
    `C ${w * 0.2} ${h * 0.55} ${w * 0.35} ${h * 0.42} ${w * 0.45} ${h * 0.48} ` +
    `S ${w * 0.62} ${h * 0.35} ${w * 0.72} ${h * 0.4} ` +
    `S ${w - pad} ${h * 0.28} ${w - pad} ${pad * 1.4}`

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Inventory value</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-[#0B2735]">$1.42M</p>
          <p className="mt-0.5 text-sm text-emerald-600">+6.8% vs last quarter</p>
        </div>
        <div className="flex gap-2">
          {['90D', '6M', '1Y'].map((r, i) => (
            <button
              key={r}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                i === 2 ? 'bg-[#0B2735] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-[220px] overflow-hidden rounded-xl bg-gradient-to-b from-slate-50/80 to-white">
        <svg viewBox={`0 0 ${w} ${h}`} className="size-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="invFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B2735" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0B2735" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={pad}
              y1={pad + (i * (h - pad * 2)) / 3}
              x2={w - pad}
              y2={pad + (i * (h - pad * 2)) / 3}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}
          <path d={`${path} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`} fill="url(#invFill)" />
          <path d={path} fill="none" stroke="#0B2735" strokeWidth="2.25" strokeLinecap="round" />
          {[0.25, 0.5, 0.75].map((x) => (
            <circle key={x} cx={pad + (w - pad * 2) * x} cy={h * (0.35 + x * 0.08)} r="4" fill="white" stroke="#0B2735" strokeWidth="2" />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-6 pb-2 text-[11px] font-medium text-slate-400">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
        </div>
      </div>
    </div>
  )
}

function MonthlyPerformancePlaceholder() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const bars = [42, 55, 48, 62, 58, 71]
  const lineY = [68, 62, 65, 58, 60, 54]

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Monthly financial performance</p>
          <p className="mt-1 text-lg font-semibold text-[#0B2735]">Revenue vs. operating costs</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-[#0B2735]/80" /> Revenue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-slate-300" /> Costs
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full border-2 border-emerald-500" /> Margin %
          </span>
        </div>
      </div>
      <div className="relative h-[240px] rounded-xl bg-gradient-to-b from-slate-50/60 to-white px-2 pt-4">
        <svg viewBox="0 0 360 200" className="size-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B2735" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0B2735" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          {months.map((_, i) => {
            const x = 28 + i * 52
            const bh = bars[i]! * 1.35
            return (
              <rect key={i} x={x} y={170 - bh} width="18" height={bh} rx="5" fill="url(#barGrad)" opacity="0.92" />
            )
          })}
          {months.map((_, i) => {
            const x = 52 + i * 52
            const bh = bars[i]! * 0.55
            return <rect key={`c-${i}`} x={x} y={170 - bh} width="18" height={bh} rx="5" fill="#cbd5e1" opacity="0.95" />
          })}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={lineY.map((y, i) => `${46 + i * 52},${y + 35}`).join(' ')}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-4 text-[11px] font-medium text-slate-400">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

const topProducts = [
  { name: 'West African Cocoa — Grade A', sku: 'ZHS-COC-104', share: 94, units: '2.4k sold' },
  { name: 'Cold-pressed Palm Olein (20L)', sku: 'ZHS-OLE-088', share: 87, units: '1.9k sold' },
  { name: 'Premium Basmati Rice (25kg)', sku: 'ZHS-RIC-212', share: 76, units: '1.6k sold' },
  { name: 'Sunflower Cooking Oil (5L)', sku: 'ZHS-OIL-031', share: 68, units: '1.2k sold' },
  { name: 'Granulated Sugar (50kg)', sku: 'ZHS-SUG-017', share: 61, units: '980 sold' },
]

export default function Dashboard() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [appearanceDark, setAppearanceDark] = useState(false)

  return (
    <div className="min-h-screen text-slate-800 antialiased" style={{ backgroundColor: pageBg }}>
      {/* Mobile overlay */}
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        id="sidebar-nav"
        className={`fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-white/5 shadow-[4px_0_24px_rgba(15,23,42,0.08)] transition-transform duration-200 ease-out md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: primary }}
      >
        <div className="flex h-[4.25rem] items-center gap-3 border-b border-white/[0.08] px-5 shadow-[inset_0_-1px_0_rgba(255,255,255,0.04)]">
          <img src={logoImg} alt="" className="size-10 rounded-xl bg-white/[0.08] object-contain p-1.5 ring-1 ring-white/10" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold tracking-tight text-white">Zuba House</p>
            <p className="truncate text-[11px] font-medium text-white/50">Stock Management</p>
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
          {navItems.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white/[0.14] text-white shadow-[inset_3px_0_0_0_rgba(255,255,255,0.9)] ring-1 ring-white/[0.06]'
                  : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
              }`}
              onClick={(e) => e.preventDefault()}
            >
              <Icon className={`size-[1.125rem] shrink-0 ${active ? 'text-white' : 'text-white/55 group-hover:text-white/90'}`} />
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto shrink-0 space-y-3 border-t border-white/[0.08] p-4 pb-5">
          <div className="rounded-xl bg-white/[0.05] p-3.5 ring-1 ring-white/[0.08] backdrop-blur-sm">
            <p className="text-xs font-medium text-white/85">Warehouse sync</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/45">Last full reconciliation: today, 06:12 WAT</p>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <LogOutIcon className="size-[1.125rem] shrink-0 opacity-80" />
            Log out
          </button>
        </div>
      </aside>

      <div className="md:pl-[232px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_0_rgba(15,23,42,0.03),0_12px_40px_-24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-expanded={mobileNavOpen}
              aria-controls="sidebar-nav"
            >
              <MenuIcon className="size-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold tracking-tight text-[#0B2735] sm:text-xl">Dashboard</h1>
              <p className="mt-0.5 truncate text-sm text-slate-500">Welcome back, Honorine — here is how Zuba House is performing.</p>
            </div>

            <div className="hidden min-w-0 flex-[1.1] max-w-md lg:block">
              <label className="relative block">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <SearchIcon className="size-[1.125rem]" />
                </span>
                <input
                  type="search"
                  placeholder="Search products, sales, expenses..."
                  className="w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-[#0B2735]/20 focus:ring-[3px] focus:ring-[#0B2735]/[0.07]"
                />
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
                  HM
                </span>
                <span className="hidden text-left text-sm sm:block">
                  <span className="block font-semibold text-[#0B2735]">Honorine M.</span>
                  <span className="block text-xs text-slate-500">Operations Lead</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* KPI row */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Total stock',
                value: '12,847',
                sub: 'units on hand across 3 hubs',
                trend: '+4.2%',
                up: true,
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5v-.75A2.25 2.25 0 0 0 18 4.5h-2.25a2.25 2.25 0 0 0-2.25 2.25v.75m8.25-3h-12a2.25 2.25 0 0 0-2.25 2.25v.75m16.5 0v4.125c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125V7.5m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.992 19.242 18 18 18h-1.5m1.5-18v3.75M3.375 18h7.5c.621 0 1.125-.504 1.125-1.125V11.25a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3.75H9.375" />
                  </svg>
                ),
              },
              {
                title: 'Revenue (MTD)',
                value: '$284,920',
                sub: 'invoiced sales, net of returns',
                trend: '+8.1%',
                up: true,
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: 'Profit (MTD)',
                value: '$42,180',
                sub: 'after landed cost allocation',
                trend: '+3.4%',
                up: true,
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0 5.94-2.28m-5.94 2.28-2.28 5.941" />
                  </svg>
                ),
              },
              {
                title: 'Expenses (MTD)',
                value: '$18,340',
                sub: 'logistics, utilities, payroll',
                trend: '-1.2%',
                up: false,
                icon: (
                  <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M12 6V3.75m0 2.25V6Z" />
                  </svg>
                ),
              },
            ].map((k) => (
              <article
                key={k.title}
                className="group flex min-h-[152px] flex-col rounded-2xl border border-slate-200/50 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_14px_36px_-12px_rgba(15,23,42,0.09)] ring-1 ring-slate-100/80 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{k.title}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0B2735] sm:text-[1.65rem]">{k.value}</p>
                  </div>
                  <IconBox className="text-[#0B2735] transition group-hover:bg-[#0B2735]/10">{k.icon}</IconBox>
                </div>
                <p className="mt-2 text-sm text-slate-500">{k.sub}</p>
                <div className="mt-auto flex items-center gap-1.5 pt-4 text-sm">
                  {k.up ? (
                    <TrendUp className="size-4 text-emerald-600" />
                  ) : (
                    <TrendDown className="size-4 text-emerald-600" />
                  )}
                  <span className={`font-semibold ${k.up ? 'text-emerald-600' : 'text-emerald-700'}`}>{k.trend}</span>
                  <span className="text-slate-400">vs prior month</span>
                </div>
              </article>
            ))}
          </section>

          {/* Section 2: 65 / 35 */}
          <section className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="lg:w-[65%] lg:min-w-0 lg:flex-1">
              <article className="h-full rounded-2xl border border-slate-200/50 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_18px_48px_-14px_rgba(15,23,42,0.1)] ring-1 ring-slate-100/80">
                <InventoryValueChartPlaceholder />
              </article>
            </div>
            <div className="lg:w-[35%] lg:min-w-0 lg:max-w-md lg:shrink-0">
              <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#0B2735] via-[#0f3244] to-[#123a4f] p-6 text-white shadow-[0_18px_48px_-12px_rgba(11,39,53,0.45)] ring-1 ring-white/10">
                <p className="text-xs font-medium uppercase tracking-wide text-white/55">Net profit (MTD)</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight sm:text-[2.65rem]">$23,840</p>
                <p className="mt-2 text-sm text-white/65">Operating margin holding steady after freight normalization.</p>
                <div className="mt-8 space-y-4 border-t border-white/15 pt-6">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/70">Gross profit</span>
                    <span className="font-semibold tabular-nums">$42,180</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[78%] rounded-full bg-emerald-400/90" />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-white/70">Operating expenses</span>
                    <span className="font-semibold tabular-nums text-white/90">$18,340</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[34%] rounded-full bg-white/35" />
                  </div>
                </div>
                <p className="mt-auto pt-8 text-xs text-white/45">Figures exclude one-off equipment capex booked last week.</p>
              </article>
            </div>
          </section>

          {/* Section 3: 65 / 35 */}
          <section className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
            <div className="lg:w-[65%] lg:min-w-0 lg:flex-1">
              <article className="h-full rounded-2xl border border-slate-200/50 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_18px_48px_-14px_rgba(15,23,42,0.1)] ring-1 ring-slate-100/80">
                <MonthlyPerformancePlaceholder />
              </article>
            </div>
            <div className="lg:w-[35%] lg:min-w-0 lg:max-w-md lg:shrink-0">
              <article className="flex h-full flex-col rounded-2xl border border-slate-200/50 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_14px_36px_-12px_rgba(15,23,42,0.09)] ring-1 ring-slate-100/80">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Top products</p>
                    <p className="mt-1 text-lg font-semibold text-[#0B2735]">By sell-through</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">Last 30 days</span>
                </div>
                <ul className="space-y-4">
                  {topProducts.map((p, idx) => (
                    <li key={p.sku} className="group">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 transition group-hover:bg-[#0B2735]/10 group-hover:text-[#0B2735]">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                            <p className="truncate text-xs text-slate-500">{p.sku} · {p.units}</p>
                          </div>
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-600">{p.share}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400/90 transition-all group-hover:from-[#0B2735] group-hover:to-[#134a63]"
                          style={{ width: `${p.share}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
