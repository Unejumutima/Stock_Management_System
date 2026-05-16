import { useMemo, useState } from 'react'
import { ChevronDownIcon, DownloadIcon, SearchIcon } from '../constants/icons'
import {
  INVENTORY_CATEGORIES,
  INVENTORY_ROWS,
  LOW_STOCK_ALERTS,
  RECENT_UPDATES,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  STOCK_STATUS_OPTIONS,
  type StockStatus,
} from '../constants/inventory'
import { btnPrimaryClass, inputClass, panelClass, selectClass } from '../constants/theme'
import { AppLayout } from './layout/AppLayout'
import { KpiCard } from './ui/KpiCard'

export default function Inventory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    return INVENTORY_ROWS.filter((row) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.sku.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      const matchesCategory = category === 'All categories' || row.category === category
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      return matchesQuery && matchesCategory && matchesStatus
    })
  }, [query, category, statusFilter])

  const lowCount = INVENTORY_ROWS.filter((r) => r.status === 'low_stock' || r.status === 'out_of_stock').length
  const totalUnits = INVENTORY_ROWS.reduce((sum, r) => sum + r.current, 0)

  return (
    <AppLayout
      title="Inventory"
      subtitle="Monitor stock levels, movements, and replenishment across Zuba House warehouses."
      searchPlaceholder="Search products, sales, expenses..."
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Inventory overview</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Track on-hand units, purchase and sales movements, and stock health in real time.
          </p>
        </div>
        <button type="button" className={btnPrimaryClass}>
          <DownloadIcon className="size-4" />
          Export Inventory
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          compact
          title="Total products"
          value="248"
          icon={
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25" />
            </svg>
          }
        />
        <KpiCard
          compact
          title="Total units in stock"
          value={totalUnits.toLocaleString()}
          icon={
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5v-.75A2.25 2.25 0 0 0 18 4.5h-2.25a2.25 2.25 0 0 0-2.25 2.25v.75m8.25-3h-12a2.25 2.25 0 0 0-2.25 2.25v.75" />
            </svg>
          }
        />
        <KpiCard
          compact
          title="Low stock items"
          value={String(lowCount)}
          icon={
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
        />
        <KpiCard
          compact
          title="Inventory value"
          value="$1.42M"
          icon={
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659" />
            </svg>
          }
        />
      </section>

      <section className={`${panelClass} !p-4 sm:!p-5`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block min-w-0 flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon className="size-[1.125rem]" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inventory..."
              className={inputClass}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[180px]">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${selectClass} w-full appearance-none pr-10`}
              >
                {INVENTORY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            <StatusFilterSelect value={statusFilter} onChange={setStatusFilter} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <article className={`${panelClass} overflow-hidden !p-0`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-sm">
                <tr>
                  {['Product Name', 'SKU', 'Category', 'Qty Purchased', 'Qty Sold', 'Current Stock', 'Stock Status'].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4 font-medium text-slate-800">{row.name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">{row.sku}</td>
                    <td className="px-5 py-4 text-slate-600">{row.category}</td>
                    <td className="px-5 py-4 tabular-nums text-slate-600">{row.purchased.toLocaleString()}</td>
                    <td className="px-5 py-4 tabular-nums text-slate-600">{row.sold.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <StockValue current={row.current} status={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-500">No inventory items match your filters.</p>
          ) : null}
        </article>

        <aside className="space-y-4">
          <SidePanel title="Recently updated" items={RECENT_UPDATES.map((u) => ({ primary: u.product, secondary: u.action, meta: u.time }))} />
          <SidePanel
            title="Low stock alerts"
            items={LOW_STOCK_ALERTS.map((a) => ({
              primary: a.product,
              secondary: a.sku,
              meta: a.remaining === 0 ? 'Out of stock' : `${a.remaining} left`,
              alert: true,
            }))}
          />
          <article className={`${panelClass} !p-5`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Inventory insights</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-slate-600">Avg. days of cover</span>
                <span className="font-semibold text-[#0B2735]">18 days</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-slate-600">Reorder queue</span>
                <span className="font-semibold text-amber-700">6 SKUs</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-slate-600">Turnover (30d)</span>
                <span className="font-semibold text-emerald-600">+12.4%</span>
              </li>
            </ul>
          </article>
        </aside>
      </section>
    </AppLayout>
  )
}

function StatusFilterSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative min-w-[160px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${selectClass} w-full appearance-none pr-10`}
      >
        {STOCK_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function StockValue({ current, status }: { current: number; status: StockStatus }) {
  const emphasis =
    status === 'out_of_stock'
      ? 'font-bold text-rose-600'
      : status === 'low_stock'
        ? 'font-bold text-amber-700'
        : 'font-semibold text-[#0B2735]'
  return <span className={`tabular-nums ${emphasis}`}>{current.toLocaleString()}</span>
}

function StatusBadge({ status }: { status: StockStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

function SidePanel({
  title,
  items,
}: {
  title: string
  items: { primary: string; secondary: string; meta: string; alert?: boolean }[]
}) {
  return (
    <article className={`${panelClass} !p-5`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={`${item.primary}-${item.meta}`} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <p className="text-sm font-medium text-slate-800">{item.primary}</p>
            <p className="mt-0.5 text-xs text-slate-500">{item.secondary}</p>
            <p className={`mt-1 text-xs font-medium ${item.alert ? 'text-amber-700' : 'text-slate-400'}`}>{item.meta}</p>
          </li>
        ))}
      </ul>
    </article>
  )
}
