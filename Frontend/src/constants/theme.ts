export const colors = {
  primary: '#0B2735',
  pageBg: '#F5F7FA',
  white: '#FFFFFF',
} as const

export const layout = {
  sidebarWidth: '232px',
  maxContentWidth: '1400px',
} as const

export const cardClass =
  'rounded-2xl border border-slate-200/50 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.035),0_14px_36px_-12px_rgba(15,23,42,0.09)] ring-1 ring-slate-100/80'

export const cardHoverClass =
  'transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgba(15,23,42,0.12)]'

export const panelClass =
  'rounded-2xl border border-slate-200/50 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.035),0_18px_48px_-14px_rgba(15,23,42,0.1)] ring-1 ring-slate-100/80'

export const inputClass =
  'w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-[#0B2735]/20 focus:ring-[3px] focus:ring-[#0B2735]/[0.07]'

export const selectClass =
  'rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition focus:border-[#0B2735]/20 focus:ring-[3px] focus:ring-[#0B2735]/[0.07]'

export const btnPrimaryClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2735] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_-2px_rgba(11,39,53,0.35)] transition hover:bg-[#0f3244] hover:shadow-[0_6px_20px_-4px_rgba(11,39,53,0.4)] active:scale-[0.98]'

export const btnSecondaryClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]'

export const fieldClass =
  'w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-[#0B2735]/20 focus:ring-[3px] focus:ring-[#0B2735]/[0.07]'
