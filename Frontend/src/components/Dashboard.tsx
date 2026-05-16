import { panelClass } from '../constants/theme'
import { AppLayout } from './layout/AppLayout'
import { KpiCard } from './ui/KpiCard'

const topProducts = [
  { name: 'West African Cocoa — Grade A', sku: 'ZHS-COC-104', share: 94, units: '2.4k sold' },
  { name: 'Cold-pressed Palm Olein (20L)', sku: 'ZHS-OLE-088', share: 87, units: '1.9k sold' },
  { name: 'Premium Basmati Rice (25kg)', sku: 'ZHS-RIC-212', share: 76, units: '1.6k sold' },
  { name: 'Sunflower Cooking Oil (5L)', sku: 'ZHS-OIL-031', share: 68, units: '1.2k sold' },
  { name: 'Granulated Sugar (50kg)', sku: 'ZHS-SUG-017', share: 61, units: '980 sold' },
]

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back, Honorine — here is how Zuba House is performing."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total stock"
          value="12,847"
          sub="units on hand across 3 hubs"
          trend="+4.2%"
          icon={<StockIcon />}
        />
        <KpiCard
          title="Revenue (MTD)"
          value="$284,920"
          sub="invoiced sales, net of returns"
          trend="+8.1%"
          icon={<RevenueIcon />}
        />
        <KpiCard
          title="Profit (MTD)"
          value="$42,180"
          sub="after landed cost allocation"
          trend="+3.4%"
          icon={<ProfitIcon />}
        />
        <KpiCard
          title="Expenses (MTD)"
          value="$18,340"
          sub="logistics, utilities, payroll"
          trend="-1.2%"
          trendUp={false}
          icon={<ExpenseIcon />}
        />
      </section>

      <section className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="lg:w-[65%] lg:min-w-0 lg:flex-1">
          <article className={`h-full ${panelClass}`}>
            <InventoryValueChartPlaceholder />
          </article>
        </div>
        <NetProfitCard />
      </section>

      <section className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="lg:w-[65%] lg:min-w-0 lg:flex-1">
          <article className={`h-full ${panelClass}`}>
            <MonthlyPerformancePlaceholder />
          </article>
        </div>
        <div className="lg:w-[35%] lg:min-w-0 lg:max-w-md lg:shrink-0">
          <article className={`flex h-full flex-col ${panelClass}`}>
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
                        <p className="truncate text-xs text-slate-500">
                          {p.sku} · {p.units}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-600">{p.share}%</span>
                  </div>
                  <ShareProgressBar share={p.share} />
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </AppLayout>
  )
}

function NetProfitCard() {
  return (
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
            <BarFill width="78%" className="bg-emerald-400/90" />
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-white/70">Operating expenses</span>
            <span className="font-semibold tabular-nums text-white/90">$18,340</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <BarFill width="34%" className="bg-white/35" />
          </div>
        </div>
        <p className="mt-auto pt-8 text-xs text-white/45">Figures exclude one-off equipment capex booked last week.</p>
      </article>
    </div>
  )
}

function BarFill({ width, className }: { width: string; className: string }) {
  return <div className={`h-full rounded-full ${className}`} style={{ width }} />
}

function ShareProgressBar({ share }: { share: number }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400/90 transition-all group-hover:from-[#0B2735] group-hover:to-[#134a63]"
        style={{ width: `${share}%` }}
      />
    </div>
  )
}

function StockIcon() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5v-.75A2.25 2.25 0 0 0 18 4.5h-2.25a2.25 2.25 0 0 0-2.25 2.25v.75m8.25-3h-12a2.25 2.25 0 0 0-2.25 2.25v.75" />
    </svg>
  )
}

function RevenueIcon() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659" />
    </svg>
  )
}

function ProfitIcon() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0 5.94-2.28m-5.94 2.28-2.28 5.941" />
    </svg>
  )
}

function ExpenseIcon() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659" />
    </svg>
  )
}

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
    <InventoryChart
      w={w}
      h={h}
      pad={pad}
      path={path}
      title="Inventory value"
      value="$1.42M"
      delta="+6.8% vs last quarter"
    />
  )
}

function InventoryChart({
  w,
  h,
  pad,
  path,
  title,
  value,
  delta,
}: {
  w: number
  h: number
  pad: number
  path: string
  title: string
  value: string
  delta: string
}) {
  return (
    <div className="relative">
      <ChartHeader title={title} value={value} delta={delta} />
      <ChartBody w={w} h={h} pad={pad} path={path} />
    </div>
  )
}

function ChartHeader({ title, value, delta }: { title: string; value: string; delta: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-[#0B2735]">{value}</p>
        <p className="mt-0.5 text-sm text-emerald-600">{delta}</p>
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
  )
}

function ChartBody({ w, h, pad, path }: { w: number; h: number; pad: number; path: string }) {
  return (
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
      </svg>
      <ChartMonthLabels />
    </div>
  )
}

function ChartMonthLabels() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-6 pb-2 text-[11px] font-medium text-slate-400">
      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
        <span key={m}>{m}</span>
      ))}
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
            return <rect key={i} x={x} y={170 - bh} width="18" height={bh} rx="5" fill="url(#barGrad)" opacity="0.92" />
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
