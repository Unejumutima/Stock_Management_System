import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ChevronDownIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from '../constants/icons'
import { formatCurrency, PRODUCT_CATEGORIES } from '../constants/products'
import { btnPrimaryClass, btnSecondaryClass, fieldClass, inputClass, panelClass, selectClass } from '../constants/theme'
import {
  DATE_RANGE_OPTIONS,
  formatDisplayDate,
  isThisMonth,
  isWithinDateRange,
  todayISO,
  type DateRangeValue,
} from '../constants/transactions'
import { fetchProducts, type Product } from '../services/product.service'
import { createPurchase, deletePurchase, fetchPurchases, type Purchase } from '../services/purchase.service'
import { AppLayout } from './layout/AppLayout'
import { KpiCard } from './ui/KpiCard'

type PurchaseForm = {
  productId: string
  quantity: string
  pricePerUnit: string
  purchaseDate: string
}

const emptyForm = (products: Product[]): PurchaseForm => ({
  productId: products[0] ? String(products[0].id) : '',
  quantity: '',
  pricePerUnit: products[0] ? String(products[0].purchasePrice) : '',
  purchaseDate: todayISO(),
})

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [productFilter, setProductFilter] = useState('all')
  const [dateRange, setDateRange] = useState<DateRangeValue>('all')
  const [category, setCategory] = useState('All categories')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<PurchaseForm>({ productId: '', quantity: '', pricePerUnit: '', purchaseDate: todayISO() })

  useEffect(() => {
    Promise.all([fetchPurchases(), fetchProducts()])
      .then(([purchasesData, productsData]) => {
        setPurchases(purchasesData)
        setProducts(productsData)
        setForm(emptyForm(productsData))
      })
      .catch((err) => setApiError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return purchases.filter((row) => {
      const matchesQuery =
        !q ||
        row.productName.toLowerCase().includes(q) ||
        row.sku.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      const matchesProduct = productFilter === 'all' || String(row.productId) === productFilter
      const matchesCategory = category === 'All categories' || row.category === category
      const matchesDate = isWithinDateRange(row.purchaseDate, dateRange)
      return matchesQuery && matchesProduct && matchesCategory && matchesDate
    })
  }, [purchases, query, productFilter, category, dateRange])

  const stats = useMemo(() => {
    const totalUnits = purchases.reduce((sum, r) => sum + r.quantity, 0)
    const totalCost = purchases.reduce((sum, r) => sum + r.totalCost, 0)
    const monthCost = purchases
      .filter((r) => isThisMonth(r.purchaseDate))
      .reduce((sum, r) => sum + r.totalCost, 0)
    return { count: purchases.length, totalUnits, totalCost, monthCost }
  }, [purchases])

  const openAddModal = () => {
    setForm(emptyForm(products))
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm(products))
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePurchase(id)
      setPurchases((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete purchase')
    }
  }

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => String(p.id) === productId)
    setForm((f) => ({
      ...f,
      productId,
      pricePerUnit: product ? String(product.purchasePrice) : f.pricePerUnit,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const quantity = Number.parseInt(form.quantity, 10)
    const pricePerUnit = Number.parseFloat(form.pricePerUnit)
    if (!form.productId || !form.purchaseDate || Number.isNaN(quantity) || quantity <= 0 || Number.isNaN(pricePerUnit)) return

    try {
      const created = await createPurchase({
        productId: Number(form.productId),
        quantity,
        pricePerUnit,
        purchaseDate: form.purchaseDate,
      })
      setPurchases((prev) => [created, ...prev])
      closeModal()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create purchase')
    }
  }

  const productOptions = [
    { value: 'all', label: 'All products' },
    ...products.map((p) => ({ value: String(p.id), label: p.name })),
  ]

  return (
    <AppLayout
      title="Purchases"
      subtitle="Manage and track all stock purchase transactions."
      searchPlaceholder="Search products, sales, expenses..."
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Purchases</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Manage and track all stock purchase transactions that increase inventory levels.
          </p>
        </div>
        <button type="button" className={btnPrimaryClass} onClick={openAddModal}>
          <PlusIcon className="size-4" />
          Add Purchase
        </button>
      </section>

      {apiError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{apiError}</p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard compact title="Total purchases" value={String(stats.count)} sub="Recorded transactions" icon={<KpiIconReceipt />} />
        <KpiCard compact title="Total units purchased" value={stats.totalUnits.toLocaleString()} sub="Across all time" icon={<KpiIconBoxes />} />
        <KpiCard compact title="Total purchase cost" value={formatCurrency(stats.totalCost)} sub="Lifetime spend" icon={<KpiIconDollar />} />
        <KpiCard compact title="This month purchases" value={formatCurrency(stats.monthCost)} sub="May 2026" icon={<KpiIconCalendar />} />
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
              placeholder="Search purchases..."
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
            <h3 className="text-lg font-semibold text-white">Purchase history</h3>
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
            Add Purchase
          </button>
        </div>

        <article className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
          {loading ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">Loading purchases…</p>
          ) : purchases.length === 0 ? (
            <EmptyState onAdd={openAddModal} />
          ) : filtered.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">No purchases match your search or filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-sm">
                  <tr>
                    <th className="w-[26%] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Product Name</th>
                    <th className="w-[11%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">SKU</th>
                    <th className="w-[11%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Quantity</th>
                    <th className="w-[12%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Price / Unit</th>
                    <th className="w-[12%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Total Cost</th>
                    <th className="w-[14%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Purchase Date</th>
                    <th className="w-[8%] px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80">
                      <td className="px-5 py-4 font-medium text-slate-800">{row.productName}</td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-500">{row.sku}</td>
                      <td className="px-4 py-4 tabular-nums text-slate-600">{row.quantity.toLocaleString()}</td>
                      <td className="px-4 py-4 tabular-nums text-slate-600">{formatCurrency(row.pricePerUnit)}</td>
                      <td className="px-4 py-4 tabular-nums font-medium text-[#0B2735]">{formatCurrency(row.totalCost)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDisplayDate(row.purchaseDate)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <ActionButton label={`Delete purchase for ${row.productName}`} variant="danger" onClick={() => handleDelete(row.id)}>
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
        <AddPurchaseModal form={form} setForm={setForm} products={products} onProductChange={handleProductChange} onClose={closeModal} onSubmit={handleSubmit} />
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
      <span className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <KpiIconReceipt />
      </span>
      <p className="mt-5 text-base font-semibold text-[#0B2735]">No purchases recorded yet</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">Log your first stock purchase to track costs and incoming inventory.</p>
      <button type="button" className={`${btnPrimaryClass} mt-6`} onClick={onAdd}>
        <PlusIcon className="size-4" />
        Add Purchase
      </button>
    </div>
  )
}

function AddPurchaseModal({
  form,
  setForm,
  products,
  onProductChange,
  onClose,
  onSubmit,
}: {
  form: PurchaseForm
  setForm: (value: PurchaseForm | ((prev: PurchaseForm) => PurchaseForm)) => void
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
  const price = Number.parseFloat(form.pricePerUnit)
  const total = !Number.isNaN(qty) && !Number.isNaN(price) && qty > 0 ? qty * price : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="add-purchase-title">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="add-purchase-title" className="text-lg font-semibold text-[#0B2735]">
              Add purchase
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Record a stock purchase to increase on-hand inventory.</p>
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
                  <option key={p.id} value={String(p.id)}>
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
                placeholder="e.g. 120"
                className={`${fieldClass} tabular-nums`}
              />
            </FormField>
            <FormField label="Price per unit">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">$</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricePerUnit}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))}
                  placeholder="0.00"
                  className={`${fieldClass} pl-7 tabular-nums`}
                />
              </div>
            </FormField>
          </div>

          <FormField label="Purchase date">
            <input
              required
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm((f) => ({ ...f, purchaseDate: e.target.value }))}
              className={`${fieldClass} tabular-nums`}
            />
          </FormField>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total cost</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-[#0B2735]">{total !== null ? formatCurrency(total) : '—'}</p>
            <p className="mt-0.5 text-xs text-slate-500">Quantity × price per unit</p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className={btnSecondaryClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={btnPrimaryClass}>
              Save purchase
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

function KpiIconReceipt() {
  // Shopping cart — represents purchase transactions
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}

function KpiIconBoxes() {
  // Cube — represents physical units purchased
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5v9l9 5.25M3 7.5l9 5.25m0-9v9m0-9 9 5.25" />
    </svg>
  )
}

function KpiIconDollar() {
  // Banknotes — represents total purchase cost
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  )
}

function KpiIconCalendar() {
  // Calendar — represents this month's figure
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}
