import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'

type AppLayoutProps = {
  title: string
  subtitle: string
  searchPlaceholder?: string
  children: ReactNode
}

export function AppLayout({ title, subtitle, searchPlaceholder, children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 antialiased">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="md:pl-[232px]">
        <TopNavbar
          title={title}
          subtitle={subtitle}
          searchPlaceholder={searchPlaceholder}
          onMenuClick={() => setMobileNavOpen((o) => !o)}
          menuOpen={mobileNavOpen}
        />
        <main className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  )
}
