import type { ReactNode } from 'react'
import { TrendDown, TrendUp } from '../../constants/icons'
import { cardClass, cardHoverClass } from '../../constants/theme'
import { IconBox } from './IconBox'

type KpiCardProps = {
  title: string
  value: string
  sub?: string
  icon: ReactNode
  trend?: string
  trendUp?: boolean
  compact?: boolean
}

export function KpiCard({ title, value, sub, icon, trend, trendUp = true, compact }: KpiCardProps) {
  return (
    <article
      className={`group flex flex-col ${compact ? 'min-h-[132px] p-4' : 'min-h-[152px] p-5'} ${cardClass} ${cardHoverClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
          <p
            className={`mt-2 font-semibold tracking-tight text-[#0B2735] ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[1.65rem]'}`}
          >
            {value}
          </p>
        </div>
        <IconBox className="transition group-hover:bg-[#0B2735]/10">{icon}</IconBox>
      </div>
      {sub ? <p className="mt-2 text-sm text-slate-500">{sub}</p> : null}
      {trend ? (
        <div className="mt-auto flex items-center gap-1.5 pt-4 text-sm">
          {trendUp ? <TrendUp className="size-4 text-emerald-600" /> : <TrendDown className="size-4 text-emerald-600" />}
          <span className={`font-semibold ${trendUp ? 'text-emerald-600' : 'text-emerald-700'}`}>{trend}</span>
          <span className="text-slate-400">vs prior month</span>
        </div>
      ) : null}
    </article>
  )
}
