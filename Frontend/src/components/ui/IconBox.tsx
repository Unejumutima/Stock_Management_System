import type { ReactNode } from 'react'

export function IconBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2735]/[0.06] text-[#0B2735] ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
