import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Widget Design' },
  { to: '/design-system', label: 'Design System' },
  { to: '/change-log', label: 'Change Log' },
  { to: '/documentation', label: 'Documentation' },
]

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e7eaf0] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full items-center gap-2 px-4 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-1.5 text-sm font-medium text-[#5b6473] transition-colors hover:text-[#111827]',
                isActive && 'bg-[#eff4ff] text-[#2756df]',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
