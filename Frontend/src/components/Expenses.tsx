import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { ChevronDownIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from '../constants/icons'
import {
  CUSTOM_CATEGORY_VALUE,
  EXPENSE_CATEGORIES,
  EXPENSE_FILTER_CATEGORIES,
  expenseCategoryClass,
  INITIAL_EXPENSES,
  type Expense,
} from '../constants/expenses'
import { formatCurrency } from '../constants/products'
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

type ExpenseForm = {
  category: string
  customCategory: string
  amount: string
  date: string
  notes: string
}

const emptyForm = (): ExpenseForm => ({
  category: EXPENSE_CATEGORIES[0],
  customCategory: '',
  amount: '',
  date: todayISO(),
  notes: '',
})

function computeStats(expenses: Expense[]) {
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const monthExpenses = expenses.filter((e) => isThisMonth(e.date))
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)

  const byCategory = new Map<string, number>()
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount)
  }
  let topCategory = '—'
  let topAmount = 0
  for (const [cat, amt] of byCategory) {
    if (amt > topAmount) {
      topAmount = amt
      topCategory = cat
    }
  }

  const average = expenses.length > 0 ? total / expenses.length : 0

  return { total, monthTotal, topCategory, average, count: expenses.length }
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [dateRange, setDateRange] = useState<DateRangeValue>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<ExpenseForm>(emptyForm)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return expenses
      .filter((row) => {
        const matchesQuery =
          !q ||
          row.category.toLowerCase().includes(q) ||
          row.description.toLowerCase().includes(q)
        const matchesCategory = categoryFilter === 'All categories' || row.category === categoryFilter
        const matchesDate = isWithinDateRange(row.date, dateRange)
        return matchesQuery && matchesCategory && matchesDate
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [expenses, query, categoryFilter, dateRange])

  const stats = useMemo(() => computeStats(expenses), [expenses])

  const openAddModal = () => {
    setForm(emptyForm())
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm())
  }

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(form.amount)
    const category =
      form.category === CUSTOM_CATEGORY_VALUE ? form.customCategory.trim() : form.category
    if (!category || !form.date || Number.isNaN(amount) || amount <= 0) return

    setExpenses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        category,
        description: form.notes.trim() || '—',
        amount,
        date: form.date,
      },
    ])
    closeModal()
  }

  const categoryOptions = EXPENSE_FILTER_CATEGORIES.map((c) => ({ value: c, label: c }))

  return (
    <AppLayout
      title="Expenses"
      subtitle="Track and manage operational costs."
      searchPlaceholder="Search products, sales, expenses..."
    >
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0B2735]">Expenses</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Track and manage operational costs that affect net profit across Zuba House.
          </p>
        </div>
        <button type="button" className={btnPrimaryClass} onClick={openAddModal}>
          <PlusIcon className="size-4" />
          Add Expense
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard compact title="Total expenses" value={formatCurrency(stats.total)} sub={`${stats.count} recorded`} icon={<IconWallet />} />
        <KpiCard compact title="This month expenses" value={formatCurrency(stats.monthTotal)} sub="May 2026" icon={<IconCalendar />} />
        <KpiCard compact title="Highest expense category" value={stats.topCategory} sub="By lifetime spend" icon={<IconCategory />} />
        <KpiCard compact title="Average expense" value={formatCurrency(stats.average)} sub="Per transaction" icon={<IconAverage />} />
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
              placeholder="Search expenses..."
              className={inputClass}
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <FilterSelect label="Category" value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} minWidth="min-w-[200px]" />
            <FilterSelect
              label="Date range"
              value={dateRange}
              onChange={(v) => setDateRange(v as DateRangeValue)}
              options={DATE_RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              minWidth="min-w-[160px]"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#0B2735] p-5 shadow-[0_18px_48px_-12px_rgba(11,39,53,0.45)] ring-1 ring-[#0B2735]/80 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Expense ledger</h3>
            <p className="mt-0.5 text-sm text-white/60">
              {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'} shown
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 sm:hidden"
            onClick={openAddModal}
          >
            <PlusIcon className="size-4" />
            Add Expense
          </button>
        </div>

        <article className="overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/60">
          {expenses.length === 0 ? (
            <EmptyState onAdd={openAddModal} />
          ) : filtered.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">No expenses match your search or filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-sm">
                  <tr>
                    <th className="w-[22%] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                    <th className="w-[14%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</th>
                    <th className="w-[16%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                    <th className="w-[40%] px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</th>
                    <th className="w-[8%] px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <CategoryBadge category={row.category} />
                      </td>
                      <td className="px-4 py-4 tabular-nums font-semibold text-[#0B2735]">{formatCurrency(row.amount)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDisplayDate(row.date)}</td>
                      <td className="px-4 py-4 text-slate-600">{row.description}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <ActionButton label={`Delete expense: ${row.category}`} variant="danger" onClick={() => handleDelete(row.id)}>
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

      {modalOpen ? <AddExpenseModal form={form} setForm={setForm} onClose={closeModal} onSubmit={handleSubmit} /> : null}
    </AppLayout>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${expenseCategoryClass(category)}`}>
      {category}
    </span>
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
        <IconWallet />
      </span>
      <p className="mt-5 text-base font-semibold text-[#0B2735]">No expenses recorded yet</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">Add operational costs like payroll, logistics, and utilities to keep profit reports accurate.</p>
      <button type="button" className={`${btnPrimaryClass} mt-6`} onClick={onAdd}>
        <PlusIcon className="size-4" />
        Add Expense
      </button>
    </div>
  )
}

function AddExpenseModal({
  form,
  setForm,
  onClose,
  onSubmit,
}: {
  form: ExpenseForm
  setForm: (value: ExpenseForm | ((prev: ExpenseForm) => ExpenseForm)) => void
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

  const isCustom = form.category === CUSTOM_CATEGORY_VALUE

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="add-expense-title">
      <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/80">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 id="add-expense-title" className="text-lg font-semibold text-[#0B2735]">
              Add expense
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Record an operational cost for budgeting and reporting.</p>
          </div>
          <button type="button" onClick={onClose} className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <XIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <FormField label="Category">
            <div className="relative">
              <select
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`${selectClass} w-full appearance-none pr-10`}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value={CUSTOM_CATEGORY_VALUE}>Custom category…</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </FormField>

          {isCustom ? (
            <FormField label="Custom category name">
              <input
                required
                type="text"
                value={form.customCategory}
                onChange={(e) => setForm((f) => ({ ...f, customCategory: e.target.value }))}
                placeholder="e.g. Insurance, Equipment maintenance"
                className={fieldClass}
              />
            </FormField>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Amount">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">$</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className={`${fieldClass} pl-7 tabular-nums`}
                />
              </div>
            </FormField>
            <FormField label="Date">
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`${fieldClass} tabular-nums`}
              />
            </FormField>
          </div>

          <FormField label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Optional details for audit trail (vendor, invoice #, etc.)"
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </FormField>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button type="button" className={btnSecondaryClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={btnPrimaryClass}>
              Save expense
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

function IconWallet() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-3-3m6.75 5.25v4.125c0 .621-.504 1.125-1.125 1.125H4.875A1.875 1.875 0 0 1 3 16.125V7.875C3 6.839 3.84 6 4.875 6h11.25c.621 0 1.125.504 1.125 1.125v0c0 .621.504 1.125 1.125 1.125H18a2.25 2.25 0 0 1 2.25 2.25Z" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function IconCategory() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  )
}

function IconAverage() {
  return (
    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )
}
