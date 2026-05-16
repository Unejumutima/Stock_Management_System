import type { ComponentType, SVGProps } from 'react'
import {
  NavIconArchive,
  NavIconCart,
  NavIconChart,
  NavIconCube,
  NavIconDashboard,
  NavIconReceipt,
  NavIconWallet,
} from './icons'

export type NavIcon = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

export type NavItem = {
  label: string
  path: string
  icon: NavIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: NavIconDashboard },
  { label: 'Products', path: '/products', icon: NavIconCube },
  { label: 'Inventory', path: '/inventory', icon: NavIconArchive },
  { label: 'Purchases', path: '/purchases', icon: NavIconCart },
  { label: 'Sales', path: '/sales', icon: NavIconReceipt },
  { label: 'Expenses', path: '/expenses', icon: NavIconWallet },
  { label: 'Reports', path: '/reports', icon: NavIconChart },
]

export const DEFAULT_SEARCH_PLACEHOLDER = 'Search products, sales, expenses...'

export const USER = {
  initials: 'HM',
  name: 'Honorine M.',
  role: 'Operations Lead',
} as const
