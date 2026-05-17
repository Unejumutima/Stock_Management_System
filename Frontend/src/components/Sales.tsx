import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ChevronDownIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from '../constants/icons'
import { formatCurrency, INITIAL_PRODUCTS, PRODUCT_CATEGORIES, type Product } from '../constants/products'
import { INITIAL_SALES, saleTotalRevenue, type Sale } from '../constants/sales'
import { btnPrimaryClass, btnSecondaryClass, fieldClass, inputClass, panelClass, selectClass } from '../constants/theme'
import {
  DATE_RANGE_OPTIONS,
  formatDisplayDate,
  isThisMonth,
  isWithinDateRange,
  todayISO,
  type DateRangeValue,
} from '../constants/transactions'
import { AppLayout } from './layout/AppLayout'
import { KpiCard } from './ui/KpiCard'

type SaleForm = {
  productId: string
  quantity: string
  sellingPrice: string
  saleDate: string
}

const emptyForm = (): SaleForm => ({
  productId: INITIAL_PRODUCTS[0]?.id ?? '',
  quantity: '',
  sellingPrice: INITIAL_PRODUCTS[0] ? String(INITIAL_PRODUCTS[0].sellingPrice) : '',
  saleDate: todayISO(),
})

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)
  const [query, setQuery] = useState('')
  const [productFilter, setProductFilter] = useState('all')
  const [dateRange, setDateRange] = useState<DateRangeValue>('all')
  const [category, setCategory] = useState('All categories')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<SaleForm>(emptyForm)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sales.filter((row) => {
      const matchesQuery =
        !q ||
        row.productName.toLowerCase().includes(q) ||
        row.sku.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      const matchesProduct = productFilter === 'all' || row.productId === productFilter
      const matchesCategory = category === 'All categories' || row.category === category
      const matchesDate = isWithinDateRange(row.saleDate, dateRange)
      return matchesQuery && matchesProduct && matchesCategory && matchesDate
    })
  }, [sales, query, productFilter, category, dateRange])

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, r) => sum + saleTotalRevenue(r), 0)
    const totalUnits = sales.reduce((sum, r) => sum + r.quantity, 0)
    const monthRevenue = sales
      .filter((r) => isThisMonth(r.saleDate))
      .reduce((sum, r) => sum + saleTotalRevenue(r), 0)
    return { count: sales.length, totalRevenue, totalUnits, monthRevenue }
  }, [sales])

  const openAddModal = () => {
    setForm(emptyForm())
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm())
  }

  const handleDelete = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id))
  }

  const handleProductChange = (productId: string) => {
    const product = INITIAL_PRODUCTS.find((p) => p.id === productId)
    setForm((f) => ({
      ...f,
      productId,
      sellingPrice: product ? String(product.sellingPrice) : f.sellingPrice,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const product = INITIAL_PRODUCTS.find((p) => p.id === form.productId)
    const quantity = Number.parseInt(form.quantity, 10)
    const sellingPrice = Number.parseFloat(form.sellingPrice)
    if (!product || !form.saleDate || Number.isNaN(quantity) || quantity <= 0 || Number.isNaN(sellingPrice)) return

    setSales((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        category: product.category,
        quantity,
        sellingPrice,
        saleDate: form.saleDate,
      },
    ])
    closeModal()
  }

  const productOptions = [
    { value: 'all', label: 'All products' },
    ...INITIAL_PRODUCTS.map((p) => ({ value: p.id, label: p.name })),
  ]

  return (
    <AppLayout
      title="Sales"
      subtitle="Track product sales and revenue."
      searchPlaceholder="Search products, sales, expenses..."
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Sales</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Track product sales, revenue, and stock reductions across your store.
          </p>
        </div>
        <button type="button" className={btnPrimaryClass} onClick={openAddModal}>
          <PlusIcon className="size-4" />
          Add Sale
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard compact title="Total sales" value={String(stats.count)} sub="Recorded transactions" icon={<KpiIconTrend />} />
        <KpiCard compact title="Total revenue" value={formatCurrency(stats.totalRevenue)} sub="Lifetime revenue" icon={<KpiIconDollar />} />
        <KpiCard compact title="Units sold" value={stats.totalUnits.toLocaleString()} sub="Across all time" icon={<KpiIconBoxes />} />
        <KpiCard compact title="This month revenue" value={formatCurrency(stats.monthRevenue)} sub="May 2026" icon={<KpiIconCalendar />} />
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
              placeholder="Search sales..."
              className={inputClass}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <FilterSelect label="Product" value={productFilter} onChange={setProductFilter} options={productOptions} minWidth="min-w-[200px]" />
            <FilterSelect
              label="Date range"
              value={dateRange}
              onChange={(v) => setDateRange(v as DateRangeValue)}
              options={DATE_RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              minWidth="min-w-[160px]"
            />
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#0B2735] p-5 shadow-[0_18px_48px_-12px_rgba(11,39,53,0.45)] ring-1 ring-[#0B2735]/80 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Sales history</h3>
            <p className="mt-0.5 text-sm text-white/60">
              {filtered.length} {filtered.length === 1 ? 'transaction' : 'transactions'} shown
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:hidden"
            onClick={openAddModal}
          >
            <PlusIcon className="size-4" />
            Add Sale
          </button>
        </div>

        <article className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
          {sales.length === 0 ? (
            <EmptyState onAdd={openAddModal} />
          ) : filtered.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">No sales match your search or filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-sm">
                  <tr>
                    <th className="w-[26%] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Product Name</th>
                    <th className="w-[11%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">SKU</th>
                    <th className="w-[11%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Quantity</th>
                    <th className="w-[12%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Selling Price</th>
                    <th className="w-[12%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Total Revenue</th>
                    <th className="w-[14%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Sale Date</th>
                    <th className="w-[8%] px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80">
                      <td className="px-5 py-4 font-medium text-slate-800">{row.productName}</td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-500">{row.sku}</td>
                      <td className="px-4 py-4 tabular-nums text-slate-600">{row.quantity.toLocaleString()}</td>
                      <td className="px-4 py-4 tabular-nums text-slate-600">{formatCurrency(row.sellingPrice)}</td>
                      <td className="px-4 py-4 tabular-nums font-semibold text-emerald-700">{formatCurrency(saleTotalRevenue(row))}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDisplayDate(row.saleDate)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <ActionButton label={`Delete sale for ${row.productName}`} variant="danger" onClick={() => handleDelete(row.id)}>
                            <TrashIcon className="size-4" />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      {modalOpen ? (
        <AddSaleModal form={form} setForm={setForm} products={INITIAL_PRODUCTS} onProductChange={handleProductChange} onClose={closeModal} onSubmit={handleSubmit} />
      ) : null}
    </AppLayout>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  minWidth = 'min-w-[180px]',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  minWidth?: string
}) {
  return (
    <div className={`relative ${minWidth}`}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className={`${selectClass} w-full appearance-none pr-10`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function ActionButton({
  children,
  label,
  onClick,
  variant = 'default',
}: {
  children: ReactNode
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}) {
  const styles =
    variant === 'danger'
      ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-600'
      : 'text-slate-400 hover:bg-slate-100 hover:text-[#0B2735]'
  return (
    <button type="button" aria-label={label} onClick={onClick} className={`inline-flex size-8 items-center justify-center rounded-lg transition ${styles}`}>
      {children}
    </button>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <KpiIconTrend />
      </span>
      <p className="mt-5 text-base font-semibold text-[#0B2735]">No sales recorded yet</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">Log your first sale to track revenue and outgoing stock movements.</p>
      <button type="button" className={`${btnPrimaryClass} mt-6`} onClick={onAdd}>
        <PlusIcon className="size-4" />
        Add Sale
      </button>
    </div>
  )
}

function AddSaleModal({
  form,
  setForm,
  products,
  onProductChange,
  onClose,
  onSubmit,
}: {
  form: SaleForm
  setForm: (value: SaleForm | ((prev: SaleForm) => SaleForm)) => void
  products: Product[]
  onProductChange: (productId: string) => void
  onClose: () => void
  onSubmit: (e: FormEvent) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const qty = Number.parseInt(form.quantity, 10)
  const price = Number.parseFloat(form.sellingPrice)
  const total = !Number.isNaN(qty) && !Number.isNaN(price) && qty > 0 ? qty * price : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="add-sale-title">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="add-sale-title" className="text-lg font-semibold text-[#0B2735]">
              Add sale
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Record a sale to track revenue and reduce on-hand stock.</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <XIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <FormField label="Product">
            <div className="relative">
              <select
                required
                value={form.productId}
                onChange={(e) => onProductChange(e.target.value)}
                className={`${selectClass} w-full appearance-none pr-10`}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Quantity">
              <input
                required
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                placeholder="e.g. 48"
                className={`${fieldClass} tabular-nums`}
              />
            </FormField>
            <FormField label="Selling price">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">$</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={(e) => setForm((f) => ({ ...f, sellingPrice: e.target.value }))}
                  placeholder="0.00"
                  className={`${fieldClass} pl-7 tabular-nums`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Pre-filled from catalog; editable per transaction.</p>
            </FormField>
          </div>

          <FormField label="Sale date">
            <input
              required
              type="date"
              value={form.saleDate}
              onChange={(e) => setForm((f) => ({ ...f, saleDate: e.target.value }))}
              className={`${fieldClass} tabular-nums`}
            />
          </FormField>

          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800/80">Total revenue</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-800">{total !== null ? formatCurrency(total) : '—'}</p>
            <p className="mt-0.5 text-xs text-emerald-700/70">Quantity × selling price</p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className={btnSecondaryClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={btnPrimaryClass}>
              Save sale
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function KpiIconTrend() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.5 4.5L21.75 6.75" />
    </svg>
  )
}

function KpiIconDollar() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659" />
    </svg>
  )
}

function KpiIconBoxes() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25" />
    </svg>
  )
}

function KpiIconCalendar() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}
