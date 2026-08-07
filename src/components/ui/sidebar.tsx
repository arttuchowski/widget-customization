import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

type DivProps = React.HTMLAttributes<HTMLDivElement>

const SidebarRoot = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      'sticky top-0 self-start flex h-screen w-[var(--sidebar-width-expanded)] min-w-[var(--sidebar-width-expanded)] flex-col border-r border-[var(--sidebar-border-color)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text-primary)]',
      className,
    )}
    {...props}
  />
))
SidebarRoot.displayName = 'SidebarRoot'

const SidebarHeader = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center gap-[var(--sidebar-logo-gap)] px-[var(--sidebar-padding-x)] py-[var(--sidebar-padding-y)]', className)} {...props} />
))
SidebarHeader.displayName = 'SidebarHeader'

const SidebarNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn('flex flex-col gap-[var(--space-1)] px-[var(--sidebar-nav-padding-x)] pt-[var(--sidebar-padding-y)]', className)}
    {...props}
  />
))
SidebarNav.displayName = 'SidebarNav'

interface SidebarNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  asChild?: boolean
}

const SidebarNavButton = React.forwardRef<HTMLButtonElement, SidebarNavButtonProps>(
  ({ className, active = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : 'button'}
        className={cn(
          'flex w-full items-center gap-[var(--sidebar-nav-item-gap)] rounded-[var(--radius-md)] px-[var(--sidebar-nav-item-padding-x)] py-[var(--sidebar-nav-item-padding-y)] text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]',
          active
            ? 'bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-text-primary)] hover:bg-[var(--sidebar-item-hover-bg)]'
            : 'text-[var(--sidebar-text-primary)] hover:bg-[var(--sidebar-item-hover-bg)]',
          className,
        )}
        {...props}
      />
    )
  },
)
SidebarNavButton.displayName = 'SidebarNavButton'

const SidebarProfileArea = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative mt-auto border-t border-[var(--sidebar-border-color)] px-0 py-0',
      className,
    )}
    {...props}
  />
))
SidebarProfileArea.displayName = 'SidebarProfileArea'

const SidebarProfileTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'flex w-full items-center justify-between rounded-[var(--radius-md)] text-left transition-colors hover:bg-[var(--sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]',
      className,
    )}
    {...props}
  />
))
SidebarProfileTrigger.displayName = 'SidebarProfileTrigger'

const SidebarMenuPanel = React.forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute bottom-[var(--sidebar-profile-menu-offset)] left-[var(--sidebar-profile-padding-x)] z-30 w-[var(--sidebar-profile-menu-width)] rounded-[var(--radius-lg)] border border-[var(--sidebar-border-color-strong)] bg-[var(--sidebar-menu-bg)] p-[var(--sidebar-profile-menu-padding)] shadow-lg',
      className,
    )}
    {...props}
  />
))
SidebarMenuPanel.displayName = 'SidebarMenuPanel'

interface SidebarMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean
}

const SidebarMenuLink = React.forwardRef<HTMLAnchorElement, SidebarMenuLinkProps>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      className={cn(
        'block rounded-[var(--radius-sm)] px-[var(--sidebar-nav-item-padding-x)] py-[var(--sidebar-nav-item-padding-y)] text-sm font-medium text-[var(--sidebar-text-primary)] transition-colors hover:bg-[var(--sidebar-item-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-focus-ring)]',
        className,
      )}
      {...props}
    />
  )
})
SidebarMenuLink.displayName = 'SidebarMenuLink'

const SidebarMenuDisabledAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    disabled
    className={cn(
      'mt-[var(--space-1)] w-full cursor-not-allowed rounded-[var(--radius-sm)] px-[var(--sidebar-nav-item-padding-x)] py-[var(--sidebar-nav-item-padding-y)] text-left text-sm font-medium text-[var(--sidebar-text-disabled)]',
      className,
    )}
    {...props}
  />
))
SidebarMenuDisabledAction.displayName = 'SidebarMenuDisabledAction'

export {
  SidebarRoot,
  SidebarHeader,
  SidebarNav,
  SidebarNavButton,
  SidebarProfileArea,
  SidebarProfileTrigger,
  SidebarMenuPanel,
  SidebarMenuLink,
  SidebarMenuDisabledAction,
}
