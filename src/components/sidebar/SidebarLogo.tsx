import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { useAppGraphics } from '@/context/AppGraphicsContext'
import { SidebarHeader } from '@/components/ui/sidebar'

interface SidebarLogoProps {
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export function SidebarLogo({ collapsed = false, onToggleCollapsed }: SidebarLogoProps) {
  const { graphics } = useAppGraphics()

  return (
    <SidebarHeader className={collapsed ? 'flex-col items-center gap-[var(--space-2)] px-[var(--space-2)]' : ''}>
      <div className={collapsed ? 'flex w-full justify-center' : ''}>
        <img
          src={graphics.platformSidebarLogo}
          alt="Rezolve Pay"
          className={collapsed ? 'h-[var(--logo-size)] w-[var(--logo-size)] object-contain' : 'h-[var(--logo-size)] w-auto object-contain'}
        />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none text-[var(--sidebar-text-primary)]">Rezolve Pay</p>
          <p className="text-[11px] leading-none text-[var(--sidebar-text-secondary)]">Console</p>
        </div>
      )}

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        disabled={!onToggleCollapsed}
        className={collapsed
          ? 'flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--sidebar-text-secondary)] transition-colors hover:bg-[var(--sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
          : 'ml-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--sidebar-text-secondary)] transition-colors hover:bg-[var(--sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'}
      >
        {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </button>
    </SidebarHeader>
  )
}
