import { House, WalletCards } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { SidebarNav, SidebarNavButton } from '@/components/ui/sidebar'

const navItems = [
  { label: 'Merchants', icon: House, to: '/' },
  { label: 'PSP Providers', icon: WalletCards, to: '/psp-providers' },
]

interface SidebarMainNavProps {
  collapsed?: boolean
}

export function SidebarMainNav({ collapsed = false }: SidebarMainNavProps) {
  const { pathname } = useLocation()

  return (
    <SidebarNav className={collapsed ? 'px-[var(--space-2)]' : ''}>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)

        return (
          <SidebarNavButton
            key={item.label}
            asChild
            active={isActive}
            aria-current={isActive ? 'page' : undefined}
            className={collapsed ? 'mx-auto h-10 w-10 justify-center px-0 py-0' : ''}
            aria-label={item.label}
            title={collapsed ? item.label : undefined}
          >
            <NavLink to={item.to} end={item.to === '/'}>
              <Icon className="h-4 w-4" />
              {!collapsed && item.label}
            </NavLink>
          </SidebarNavButton>
        )
      })}
    </SidebarNav>
  )
}
