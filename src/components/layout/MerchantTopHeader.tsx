import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { userRoleOptions } from '@/config/userRoles'
import { useAppGraphics } from '@/context/AppGraphicsContext'
import { useAppUserRole } from '@/context/AppUserRoleContext'

export function MerchantTopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const { userRole, setUserRole } = useAppUserRole()
  const { graphics } = useAppGraphics()

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) {
      setIsSwitchAccountOpen(false)
    }
  }, [isMenuOpen])

  return (
    <header className="border-b border-[#e2e8f0] bg-white px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <img src={graphics.merchantHeaderLogo} alt="Rezolve Pay" className="h-10 w-auto object-contain" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl bg-[#f4f5f7] px-3 py-2 text-left transition-colors hover:bg-[#eceff3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close account menu' : 'Open account menu'}
          >
            <img src={graphics.profileImage} alt="" aria-hidden="true" className="h-8 w-8 rounded-[10px] object-cover" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight text-[#111827]">John Doe</span>
              <span className="block truncate text-xs leading-tight text-[#6b7280]">johndoe@domain.com</span>
            </span>
            <ChevronDown className={`h-4 w-4 text-[#334155] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-56 rounded-xl border border-[#d9e0ea] bg-white p-2 shadow-lg">
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
                        setIsMenuOpen(false)
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
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
