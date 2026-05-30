import { useEffect, useMemo, useState } from 'react'
import { ChevronDownIcon, DownloadIcon, SearchIcon } from '../constants/icons'
import {
  INVENTORY_CATEGORIES,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  STOCK_STATUS_OPTIONS,
  type StockStatus,
} from '../constants/inventory'
import { btnPrimaryClass, inputClass, panelClass, selectClass } from '../constants/theme'
import {
  downloadInventoryExcel,
  fetchInventory,
  fetchInventoryOverview,
  fetchLowStock,
  type InventoryItem,
  type InventoryOverview,
} from '../services/inventory.service'
import { AppLayout } from './layout/AppLayout'
import { KpiCard } from './ui/KpiCard'

function formatValue(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`
  return `$${n.toFixed(2)}`
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [overview, setOverview] = useState<InventoryOverview | null>(null)
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    Promise.all([fetchInventory(), fetchInventoryOverview(), fetchLowStock()])
      .then(([inventoryData, overviewData, lowData]) => {
        setItems(inventoryData)
        setOverview(overviewData)
        setLowStockItems(lowData)
      })
      .catch((err) => setApiError(err.response?.data?.message || 'Failed to load inventory'))
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      await downloadInventoryExcel()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const filtered = useMemo(() => {
    return items.filter((row) => {
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
  }, [items, query, category, statusFilter])

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
        <button type="button" className={btnPrimaryClass} onClick={handleExport} disabled={exporting}>
          <DownloadIcon className="size-4" />
          {exporting ? 'Exporting…' : 'Export Inventory'}
        </button>
      </section>

      {apiError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{apiError}</p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          compact
          title="Total products"
          value={overview ? String(overview.productCount) : '—'}
          icon={
            // Cube — represents distinct product SKUs
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5v9l9 5.25M3 7.5l9 5.25m0-9v9m0-9 9 5.25" />
            </svg>
          }
        />
        <KpiCard
          compact
          title="Total units in stock"
          value={overview ? overview.totalUnits.toLocaleString() : '—'}
          icon={
            // Archive box — represents stored/warehoused units
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          }
        />
        <KpiCard
          compact
          title="Low stock items"
          value={overview ? String(overview.lowStockCount + overview.outOfStockCount) : '—'}
          icon={
            // Exclamation triangle — represents warning/alert
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
        />
        <KpiCard
          compact
          title="Inventory value"
          value={overview ? formatValue(overview.totalInventoryValue) : '—'}
          icon={
            // Banknotes — represents monetary value of stock
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
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
                      <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                      Loading inventory…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                      No inventory items match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">{row.name}</td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">{row.sku}</td>
                      <td className="px-5 py-4 text-slate-600">{row.category}</td>
                      <td className="px-5 py-4 tabular-nums text-slate-600">{(row.totalPurchased ?? 0).toLocaleString()}</td>
                      <td className="px-5 py-4 tabular-nums text-slate-600">{(row.totalSold ?? 0).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <StockValue current={row.stock} status={row.status} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <aside className="space-y-4">
          {/* Low stock alerts from real API data */}
          <SidePanel
            title="Low stock alerts"
            items={lowStockItems.slice(0, 6).map((a) => ({
              primary: a.name,
              secondary: a.sku,
              meta: a.stock === 0 ? 'Out of stock' : `${a.stock} left`,
              alert: true,
            }))}
            emptyMessage="No low stock items."
          />
          <article className={`${panelClass} !p-5`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Inventory insights</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-slate-600">Out of stock</span>
                <span className="font-semibold text-rose-600">{overview ? overview.outOfStockCount : '—'}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-slate-600">Low stock</span>
                <span className="font-semibold text-amber-700">{overview ? overview.lowStockCount : '—'} SKUs</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-slate-600">Total products</span>
                <span className="font-semibold text-[#0B2735]">{overview ? overview.productCount : '—'}</span>
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
  emptyMessage,
}: {
  title: string
  items: { primary: string; secondary: string; meta: string; alert?: boolean }[]
  emptyMessage?: string
}) {
  return (
    <article className={`${panelClass} !p-5`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-xs text-slate-400">{emptyMessage ?? 'No items.'}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={`${item.primary}-${item.meta}`} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-slate-800">{item.primary}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.secondary}</p>
              <p className={`mt-1 text-xs font-medium ${item.alert ? 'text-amber-700' : 'text-slate-400'}`}>{item.meta}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
