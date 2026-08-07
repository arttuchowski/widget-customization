import { SidebarLogo } from '@/components/sidebar/SidebarLogo'
import { SidebarMainNav } from '@/components/sidebar/SidebarMainNav'
import { SidebarProfileMenu } from '@/components/sidebar/SidebarProfileMenu'
import { SidebarRoot } from '@/components/ui/sidebar'

interface SidebarProps {
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export function Sidebar({ collapsed = false, onToggleCollapsed }: SidebarProps) {
  return (
    <SidebarRoot
      className={collapsed ? 'w-[var(--sidebar-width-collapsed)] min-w-[var(--sidebar-width-collapsed)] transition-[width] duration-200' : 'transition-[width] duration-200'}
    >
      <SidebarLogo collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />
      <SidebarMainNav collapsed={collapsed} />
      <SidebarProfileMenu collapsed={collapsed} />
    </SidebarRoot>
  )
}
