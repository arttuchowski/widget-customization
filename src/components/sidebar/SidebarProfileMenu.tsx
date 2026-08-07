import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { userRoleOptions } from '@/config/userRoles'
import { useAppGraphics } from '@/context/AppGraphicsContext'
import { useAppUserRole } from '@/context/AppUserRoleContext'
import {
  SidebarMenuDisabledAction,
  SidebarMenuLink,
  SidebarMenuPanel,
  SidebarProfileArea,
  SidebarProfileTrigger,
} from '@/components/ui/sidebar'

const profileLinks = [
  { to: '/design-system', label: 'Design System' },
  { to: '/change-log', label: 'Change Log' },
  { to: '/documentation', label: 'Documentation' },
]

interface SidebarProfileMenuProps {
  collapsed?: boolean
}

export function SidebarProfileMenu({ collapsed = false }: SidebarProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const panelId = 'sidebar-profile-menu-panel'
  const { userRole, setUserRole } = useAppUserRole()
  const { graphics } = useAppGraphics()

  const selectedAccount = userRoleOptions.find((option) => option.id === userRole) ?? userRoleOptions[0]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) {
        return
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsSwitchAccountOpen(false)
    }
  }, [isOpen])

  return (
    <SidebarProfileArea ref={menuRef}>
      {isOpen && (
        <SidebarMenuPanel id={panelId} role="region" aria-label="Profile menu" className={collapsed ? 'bottom-[var(--space-2)] left-[calc(100%+var(--space-2))]' : ''}>
          {profileLinks.map((link) => (
            <SidebarMenuLink key={link.to} asChild>
              <Link to={link.to} onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            </SidebarMenuLink>
          ))}

          <button
            type="button"
            onClick={() => setIsSwitchAccountOpen((prev) => !prev)}
            aria-expanded={isSwitchAccountOpen}
            className="mt-[var(--space-1)] flex w-full items-center justify-between rounded-[var(--radius-sm)] px-[var(--sidebar-nav-item-padding-x)] py-[var(--sidebar-nav-item-padding-y)] text-left text-sm font-medium text-[var(--sidebar-text-primary)] transition-colors hover:bg-[var(--sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
          >
            <span>Switch account</span>
            <ChevronDown className={`h-4 w-4 text-[var(--sidebar-text-secondary)] transition-transform ${isSwitchAccountOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSwitchAccountOpen && (
            <div className="mt-1 space-y-1 pl-2">
              {userRoleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setUserRole(option.id)
                    setIsOpen(false)
                  }}
                  className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-[var(--sidebar-nav-item-padding-x)] py-[var(--sidebar-nav-item-padding-y)] text-left text-sm text-[var(--sidebar-text-primary)] transition-colors hover:bg-[var(--sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
                >
                  <span>{option.label}</span>
                  {userRole === option.id ? (
                    <span className="text-xs font-semibold text-[var(--sidebar-text-secondary)]">Current</span>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          <SidebarMenuDisabledAction>
            Sign out (coming soon)
          </SidebarMenuDisabledAction>
        </SidebarMenuPanel>
      )}

      <SidebarProfileTrigger
        className={collapsed ? 'h-14 justify-center rounded-none px-0' : 'h-14 rounded-none px-[var(--sidebar-profile-trigger-padding-x)]'}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close profile menu' : 'Open profile menu'}
      >
        <div className={collapsed ? 'flex items-center justify-center' : 'flex min-w-0 items-center gap-[var(--space-2)] px-[var(--sidebar-profile-inner-padding)] py-[var(--sidebar-profile-inner-padding)]'}>
          <img
            src={graphics.profileImage}
            alt=""
            aria-hidden="true"
            className="h-8 w-8 shrink-0 rounded-[var(--radius-sm)] object-cover"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-none text-[var(--sidebar-text-primary)]">Artur Tuchowski</p>
              <p className="truncate text-xs text-[var(--sidebar-text-secondary)]">{selectedAccount.label}</p>
            </div>
          )}
        </div>
        {!collapsed && <ChevronDown className="h-4 w-4 text-[var(--sidebar-text-secondary)]" />}
      </SidebarProfileTrigger>
    </SidebarProfileArea>
  )
}
