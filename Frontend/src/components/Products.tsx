import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  ChevronDownIcon,
  PackageIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from '../constants/icons'
import {
  formatCurrency,
  getStockLevel,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  STOCK_LEVEL_CLASS,
} from '../constants/products'
import { btnPrimaryClass, btnSecondaryClass, fieldClass, inputClass, panelClass, selectClass } from '../constants/theme'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  type Product,
} from '../services/product.service'
import { useNotifications } from '../context/NotificationContext'
import { AppLayout } from './layout/AppLayout'
import { useAuth } from '../context/AuthContext'

type ProductForm = {
  name: string
  sku: string
  category: string
  purchasePrice: string
  sellingPrice: string
  initialStock: string
}

const emptyForm: ProductForm = {
  name: '',
  sku: '',
  category: PRODUCT_CATEGORIES[1] ?? 'Commodities',
  purchasePrice: '',
  sellingPrice: '',
  initialStock: '',
}

export default function Products() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { push } = useNotifications()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]['value']>('name-asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)

  // Load products from API on mount
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setApiError(err.response?.data?.message || 'Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = products.filter((row) => {
      const matchesQuery =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.sku.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q)
      const matchesCategory = category === 'All categories' || row.category === category
      return matchesQuery && matchesCategory
    })

    rows = [...rows].sort((a, b) => {
      switch (sort) {
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'stock-desc':
          return b.stock - a.stock
        case 'stock-asc':
          return a.stock - b.stock
        case 'price-desc':
          return b.sellingPrice - a.sellingPrice
        case 'price-asc':
          return a.sellingPrice - b.sellingPrice
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return rows
  }, [products, query, category, sort])

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      purchasePrice: String(product.purchasePrice),
      sellingPrice: String(product.sellingPrice),
      initialStock: '',   // not editable — stock is managed via purchases
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleDelete = async (id: string) => {
    const product = products.find((p) => p.id === id)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      push({ type: 'info', category: 'product_deleted', title: 'Product deleted', message: `"${product?.name ?? 'Product'}" was removed from the catalog.` })
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete product'
      push({ type: 'error', category: 'action_error', title: 'Delete failed', message: msg })
      alert(msg)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const purchasePrice = Number.parseFloat(form.purchasePrice)
    const sellingPrice = Number.parseFloat(form.sellingPrice)
    if (!form.name.trim() || !form.sku.trim() || Number.isNaN(purchasePrice) || Number.isNaN(sellingPrice)) return

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      purchasePrice,
      sellingPrice,
      ...(editingId === null && form.initialStock.trim() !== ''
        ? { initialStock: Number.parseInt(form.initialStock, 10) }
        : {}),
    }

    try {
      if (editingId !== null) {
        const updated = await updateProduct(editingId, payload)
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)))
        push({ type: 'success', category: 'product_updated', title: 'Product updated', message: `"${payload.name}" was updated successfully.` })
      } else {
        const created = await createProduct(payload)
        setProducts((prev) => [...prev, created])
        push({ type: 'success', category: 'product_added', title: 'Product added', message: `"${payload.name}" (${payload.sku}) was added to the catalog.` })
      }
      closeModal()
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save product'
      const detail = err.response?.data?.details
      const fullMsg = detail ? `${msg}\n\n${detail}` : msg
      push({ type: 'error', category: 'action_error', title: msg, message: detail ?? msg })
      alert(fullMsg)
    }
  }

  return (
    <AppLayout
      title="Products"
      subtitle="Detailed information about your store catalog and pricing."
      searchPlaceholder="Search products, sales, expenses..."
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Products</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Manage SKUs, categories, purchase and selling prices, and on-hand stock for Zuba House.
          </p>
        </div>
        {isAdmin ? (
          <button type="button" className={btnPrimaryClass} onClick={openAddModal}>
            <PlusIcon className="size-4" />
            Add Product
          </button>
        ) : null}
      </section>

      {apiError ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{apiError}</p>
      ) : null}

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
              placeholder="Search products..."
              className={inputClass}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <FilterSelect
              label="Sort by"
              value={sort}
              onChange={(v) => setSort(v as (typeof SORT_OPTIONS)[number]['value'])}
              options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              minWidth="min-w-[200px]"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#0B2735] p-5 shadow-[0_18px_48px_-12px_rgba(11,39,53,0.45)] ring-1 ring-[#0B2735]/80 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Product catalog</h3>
            <p className="mt-0.5 text-sm text-white/60">
              {products.length} {products.length === 1 ? 'product' : 'products'} in your store
            </p>          </div>
          {isAdmin ? (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:hidden"
              onClick={openAddModal}
            >
              <PlusIcon className="size-4" />
              Add Product
            </button>
          ) : null}
        </div>

        <article className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
          {loading ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">Loading products…</p>
          ) : products.length === 0 ? (
            <EmptyState onAdd={openAddModal} />
          ) : filtered.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">No products match your search or filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-sm">
                  <tr>
                    <th className="w-[28%] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Product Name
                    </th>
                    <th className="w-[11%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      SKU
                    </th>
                    <th className="w-[14%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>
                    <th className="w-[12%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Purchase Price
                    </th>
                    <th className="w-[12%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Selling Price
                    </th>
                    <th className="w-[10%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Stock
                    </th>
                    <th className="w-[9%] px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-medium text-slate-800">{row.name}</td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-500">{row.sku}</td>
                      <td className="px-4 py-4 text-slate-600">{row.category}</td>
                      <td className="px-4 py-4 tabular-nums text-slate-600">{formatCurrency(row.purchasePrice)}</td>
                      <td className="px-4 py-4 tabular-nums font-medium text-[#0B2735]">
                        {formatCurrency(row.sellingPrice)}
                      </td>
                      <td className="px-4 py-4">
                        <StockBadge stock={row.stock} />
                      </td>
                      <td className="px-4 py-4">
                        {isAdmin ? (
                          <div className="flex items-center justify-end gap-1">
                            <ActionButton label={`Edit ${row.name}`} onClick={() => openEditModal(row)}>
                              <PencilIcon className="size-4" />
                            </ActionButton>
                            <ActionButton label={`Delete ${row.name}`} variant="danger" onClick={() => handleDelete(row.id)}>
                              <TrashIcon className="size-4" />
                            </ActionButton>
                          </div>
                        ) : null}
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
        <AddProductModal
          form={form}
          setForm={setForm}
      editing={editingId !== null}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`${selectClass} w-full appearance-none pr-10`}
      >
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

function StockBadge({ stock }: { stock: number }) {
  const level = getStockLevel(stock)
  return (
    <span
      className={`inline-flex min-w-[3.25rem] justify-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ring-1 ring-inset ${STOCK_LEVEL_CLASS[level]}`}
    >
      {stock.toLocaleString()}
    </span>
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
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex size-8 items-center justify-center rounded-lg transition ${styles}`}
    >
      {children}
    </button>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <PackageIcon className="size-8" />
      </span>
      <p className="mt-5 text-base font-semibold text-[#0B2735]">No products added yet</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Start building your catalog by adding your first product with SKU, category, and pricing details.
      </p>
      <button type="button" className={`${btnPrimaryClass} mt-6`} onClick={onAdd}>
        <PlusIcon className="size-4" />
        Add Product
      </button>
    </div>
  )
}

function AddProductModal({
  form,
  setForm,
  editing,
  onClose,
  onSubmit,
}: {
  form: ProductForm
  setForm: (value: ProductForm | ((prev: ProductForm) => ProductForm)) => void
  editing: boolean
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

  const categoryOptions = PRODUCT_CATEGORIES.filter((c) => c !== 'All categories')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-product-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="add-product-title" className="text-lg font-semibold text-[#0B2735]">
              {editing ? 'Edit product' : 'Add product'}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {editing ? 'Update catalog details for this SKU.' : 'Enter product details to add it to your catalog.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <FormField label="Product Name">
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Premium Basmati Rice (25kg)"
              className={fieldClass}
            />
          </FormField>
          <FormField label="SKU">
            <input
              required
              type="text"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              placeholder="e.g. ZHS-RIC-212"
              className={`${fieldClass} font-mono uppercase`}
            />
          </FormField>
          <FormField label="Category">
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`${selectClass} w-full appearance-none pr-10`}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Purchase Price">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                  $
                </span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={(e) => setForm((f) => ({ ...f, purchasePrice: e.target.value }))}
                  placeholder="0.00"
                  className={`${fieldClass} pl-7 tabular-nums`}
                />
              </div>
            </FormField>
            <FormField label="Selling Price">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                  $
                </span>
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
            </FormField>
          </div>

          {!editing ? (
            <FormField label="Initial Stock (optional)">
              <input
                type="number"
                min="0"
                step="1"
                value={form.initialStock}
                onChange={(e) => setForm((f) => ({ ...f, initialStock: e.target.value }))}
                placeholder="e.g. 100 — leave blank for 0"
                className={`${fieldClass} tabular-nums`}
              />
              <p className="mt-1 text-xs text-slate-500">
                Sets the opening stock by creating a purchase record at the purchase price.
              </p>
            </FormField>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className={btnSecondaryClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={btnPrimaryClass}>
              {editing ? 'Save changes' : 'Save product'}
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
