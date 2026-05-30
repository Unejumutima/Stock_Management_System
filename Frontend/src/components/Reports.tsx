import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDownIcon, DownloadIcon, XIcon } from '../constants/icons'
import { formatCurrency } from '../constants/products'
import { REPORT_MONTHS, REPORT_YEARS } from '../constants/reports'
import { btnPrimaryClass, btnSecondaryClass, fieldClass, panelClass, selectClass } from '../constants/theme'
import {
  downloadMonthlyReportExcel,
  fetchMonthlyReport,
  type MonthlyReport,
} from '../services/report.service'
import { AppLayout } from './layout/AppLayout'
import { KpiCard } from './ui/KpiCard'

function defaultPeriod() {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export default function Reports() {
  const defaults = defaultPeriod()
  const [month, setMonth] = useState(String(defaults.month))
  const [year, setYear] = useState(String(defaults.year))
  const [useCustomRange, setUseCustomRange] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  // Fetch report whenever period changes
  useEffect(() => {
    setLoading(true)
    setApiError(null)
    const params = useCustomRange && customFrom && customTo
      ? { month: Number(month), year: Number(year), from: customFrom, to: customTo }
      : { month: Number(month), year: Number(year) }
    fetchMonthlyReport(params)
      .then(setReport)
      .catch((err) => setApiError(err.response?.data?.message || 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [month, year, useCustomRange, customFrom, customTo])

  const handleExport = async () => {
    const params = useCustomRange && customFrom && customTo
      ? { month: Number(month), year: Number(year), from: customFrom, to: customTo }
      : { month: Number(month), year: Number(year) }
    try {
      await downloadMonthlyReportExcel(params)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Export failed')
    }
  }

  const periodLabel = report?.period?.label ?? `${REPORT_MONTHS.find(m => m.value === month)?.label ?? month} ${year}`

  return (
    <AppLayout title="Reports" subtitle="Generate and export financial reports.">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Reports</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">Generate and export monthly financial reports for Zuba House.</p>
        </div>
        <button type="button" className={btnPrimaryClass} onClick={handleExport}>
          <DownloadIcon className="size-4" />
          Export Monthly Report (.xlsx)
        </button>
      </section>

      {/* Period selector */}
      <section className={`${panelClass} !p-4 sm:!p-5`}>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#0B2735]">Report period</h3>
            <p className="text-xs text-slate-500">Select month and year, or use a custom date range.</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-[#0B2735]/[0.06] px-3 py-1 text-xs font-medium text-[#0B2735]">
            Viewing: {periodLabel}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <FilterSelect label="Month" value={month} onChange={setMonth} disabled={useCustomRange}
            options={REPORT_MONTHS.map((m) => ({ value: m.value, label: m.label }))} />
          <FilterSelect label="Year" value={year} onChange={setYear} disabled={useCustomRange}
            options={REPORT_YEARS.map((y) => ({ value: y, label: y }))} />
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700">
            <input type="checkbox" checked={useCustomRange} onChange={(e) => setUseCustomRange(e.target.checked)}
              className="size-4 rounded border-slate-300 text-[#0B2735] focus:ring-[#0B2735]/20" />
            Custom date range
          </label>
        </div>
        {useCustomRange ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-md">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">From</span>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">To</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className={fieldClass} />
            </label>
          </div>
        ) : null}
      </section>

      {apiError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{apiError}</p>
      ) : null}

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Loading report…</p>
      ) : report ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard compact title="Total revenue" value={formatCurrency(report.summary.totalRevenue)} sub={periodLabel} icon={<IconRevenue />} />
            <KpiCard compact title="Total expenses" value={formatCurrency(report.summary.totalExpenses)} sub="Purchases + operating" icon={<IconExpense />} />
            <KpiCard compact title="Gross profit" value={formatCurrency(report.summary.grossProfit)} sub="After product COGS" icon={<IconProfit />} />
            <KpiCard compact title="Net profit" value={formatCurrency(report.summary.netProfit)} sub="Revenue − all expenses" icon={<IconNet />} />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <RevenueVsExpensesChart data={report.revenueVsExpenses} trend={report.profitTrend} />
            <ProfitTrendChart points={report.profitTrend} />
          </section>

          <DetailedReportTables report={report} />

          <section className={`${panelClass} border-[#0B2735]/10 bg-gradient-to-br from-white to-slate-50/80`}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-lg">
                <h3 className="text-lg font-semibold text-[#0B2735]">Export financial report</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Download a multi-sheet Excel workbook for <span className="font-medium text-slate-700">{periodLabel}</span>.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="button" className={btnSecondaryClass} onClick={() => setPreviewOpen(true)}>Preview report</button>
                <button type="button" className={btnPrimaryClass} onClick={handleExport}>
                  <DownloadIcon className="size-4" />
                  Download Excel (.xlsx)
                </button>
              </div>
            </div>
          </section>

          {previewOpen ? <ReportPreviewModal report={report} periodLabel={periodLabel} onClose={() => setPreviewOpen(false)} onExport={handleExport} /> : null}
        </>
      ) : null}
    </AppLayout>
  )
}

function FilterSelect({ label, value, onChange, options, disabled }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; disabled?: boolean
}) {
  return (
    <div className="relative min-w-[160px]">
      <span className="sr-only">{label}</span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} aria-label={label}
        className={`${selectClass} w-full appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-50`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function RevenueVsExpensesChart({ data, trend }: {
  data: { revenue: number; expenses: number }
  trend: { label: string; revenue: number; expenses: number; profit: number }[]
}) {
  const max = Math.max(data.revenue, data.expenses, 1)
  const revPct = (data.revenue / max) * 100
  const expPct = (data.expenses / max) * 100
  const maxBar = Math.max(...trend.flatMap((t) => [t.revenue, t.expenses]), 1)
  return (
    <article className={panelClass}>
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Revenue vs expenses</p>
        <p className="mt-1 text-lg font-semibold text-[#0B2735]">Period comparison</p>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <BarMetric label="Revenue" value={formatCurrency(data.revenue)} pct={revPct} color="bg-[#0B2735]" />
        <BarMetric label="Expenses" value={formatCurrency(data.expenses)} pct={expPct} color="bg-slate-300" />
      </div>
      <div className="relative h-[200px] rounded-xl bg-gradient-to-b from-slate-50/80 to-white px-1 pt-2">
        <svg viewBox="0 0 360 180" className="size-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B2735" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0B2735" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {trend.map((t, i) => {
            const x = 24 + i * 54
            const rh = (t.revenue / maxBar) * 120
            const eh = (t.expenses / maxBar) * 120
            return (
              <g key={t.label}>
                <rect x={x} y={150 - rh} width="16" height={rh} rx="4" fill="url(#revBar)" />
                <rect x={x + 20} y={150 - eh} width="16" height={eh} rx="4" fill="#cbd5e1" />
              </g>
            )
          })}
        </svg>
        <div className="absolute inset-x-0 bottom-1 flex justify-between px-3 text-[10px] font-medium text-slate-400">
          {trend.map((t) => <span key={t.label}>{t.label}</span>)}
        </div>
      </div>
    </article>
  )
}

function BarMetric({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-[#0B2735]">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

function ProfitTrendChart({ points }: { points: { label: string; profit: number }[] }) {
  const w = 360; const h = 180; const pad = 20

  if (points.length === 0) {
    return (
      <article className={panelClass}>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Profit trend</p>
          <p className="mt-1 text-lg font-semibold text-[#0B2735]">Net profit (6 months)</p>
        </div>
        <div className="flex h-[220px] items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/80 to-white">
          <p className="text-sm text-slate-400">No data available for this period.</p>
        </div>
      </article>
    )
  }
  const profits = points.map((p) => p.profit)
  const minP = Math.min(...profits, 0)
  const maxP = Math.max(...profits, 1)
  const range = maxP - minP || 1
  const coords = points.map((p, i) => ({
    x: pad + (i / Math.max(points.length - 1, 1)) * (w - pad * 2),
    y: pad + (1 - (p.profit - minP) / range) * (h - pad * 2),
    label: p.label, profit: p.profit,
  }))
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x ?? pad} ${h - pad} L ${coords[0]?.x ?? pad} ${h - pad} Z`
  return (
    <article className={panelClass}>
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Profit trend</p>
        <p className="mt-1 text-lg font-semibold text-[#0B2735]">Net profit (6 months)</p>
      </div>
      <div className="relative h-[220px] overflow-hidden rounded-xl bg-gradient-to-b from-slate-50/80 to-white">
        <svg viewBox={`0 0 ${w} ${h}`} className="size-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0,1,2,3].map((i) => (
            <line key={i} x1={pad} y1={pad + (i*(h-pad*2))/3} x2={w-pad} y2={pad + (i*(h-pad*2))/3} stroke="#e2e8f0" strokeWidth="1" />
          ))}
          <path d={areaPath} fill="url(#profitFill)" />
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {coords.map((c) => <circle key={c.label} cx={c.x} cy={c.y} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" />)}
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-between px-4 text-[10px] font-medium text-slate-400">
          {points.map((p) => <span key={p.label}>{p.label}</span>)}
        </div>
      </div>
    </article>
  )
}

function DetailedReportTables({ report }: { report: MonthlyReport }) {
  return (
    <section className="space-y-6">
      <TableSection title="Product performance summary" description="Revenue, COGS, and margin by SKU for the selected period.">
        <DataTable
          headers={['Product', 'SKU', 'Units', 'Revenue', 'COGS', 'Gross profit', 'Margin']}
          rows={report.productPerformance.map((r) => [r.name, r.sku, r.unitsSold.toLocaleString(), formatCurrency(r.revenue), formatCurrency(r.cogs), formatCurrency(r.grossProfit), `${r.marginPct.toFixed(1)}%`])}
          emptyMessage="No sales recorded for this period."
        />
      </TableSection>
      <div className="grid gap-6 lg:grid-cols-2">
        <TableSection title="Top selling products" description="Ranked by units sold.">
          <DataTable headers={['#', 'Product', 'Units', 'Revenue']}
            rows={report.topSelling.map((r, i) => [String(i+1), r.name, r.unitsSold.toLocaleString(), formatCurrency(r.revenue)])}
            compact emptyMessage="No sales data." />
        </TableSection>
        <TableSection title="Expense breakdown" description="Operating costs and inventory purchases.">
          <DataTable headers={['Category', 'Amount']}
            rows={report.expenseBreakdown.map((r) => [r.category, formatCurrency(r.amount)])}
            compact emptyMessage="No expenses recorded." />
        </TableSection>
      </div>
    </section>
  )
}

function TableSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-[#0B2735] p-5 shadow-[0_18px_48px_-12px_rgba(11,39,53,0.45)] ring-1 ring-[#0B2735]/80 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-0.5 text-sm text-white/60">{description}</p>
      </div>
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/60">{children}</div>
    </article>
  )
}

function DataTable({ headers, rows, compact, emptyMessage }: {
  headers: string[]; rows: string[][]; compact?: boolean; emptyMessage: string
}) {
  if (rows.length === 0) return <p className="px-5 py-10 text-center text-sm text-slate-500">{emptyMessage}</p>
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse text-left text-sm ${compact ? '' : 'min-w-[640px]'}`}>
        <thead className="border-b border-slate-200/80 bg-slate-50/95">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 first:pl-5">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-3.5 text-slate-700 first:pl-5 ${ci === 0 && !compact ? 'font-medium text-slate-800' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReportPreviewModal({ report, periodLabel, onClose, onExport }: {
  report: MonthlyReport; periodLabel: string; onClose: () => void; onExport: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#0B2735]">Report preview</h2>
            <p className="mt-0.5 text-sm text-slate-500">{periodLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex size-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100" aria-label="Close">
            <XIcon className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Total revenue', value: formatCurrency(report.summary.totalRevenue) },
              { label: 'Total expenses', value: formatCurrency(report.summary.totalExpenses) },
              { label: 'Gross profit', value: formatCurrency(report.summary.grossProfit) },
              { label: 'Net profit', value: formatCurrency(report.summary.netProfit), highlight: true },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.highlight ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200/80 bg-slate-50/50'}`}>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className={`mt-1 text-lg font-semibold tabular-nums ${s.highlight ? 'text-emerald-800' : 'text-[#0B2735]'}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" className={btnSecondaryClass} onClick={onClose}>Close</button>
          <button type="button" className={btnPrimaryClass} onClick={onExport}><DownloadIcon className="size-4" />Export .xlsx</button>
        </div>
      </div>
    </div>
  )
}

function IconRevenue() {
  return <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659" /></svg>
}
function IconExpense() {
  return <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0 5.94-2.28m-5.94 2.28-2.28 5.941" /></svg>
}
function IconProfit() {
  return <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Z" /></svg>
}
function IconNet() {
  return <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
}
